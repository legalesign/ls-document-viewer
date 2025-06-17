import { Component, Host, Prop, Watch, h, Element, Method } from '@stencil/core';
import { Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement'
import { PDFDocument } from 'pdf-lib'
import {
  PDFDocumentProxy,
  PDFPageProxy,
  PDFPageViewport,
  PDFRenderParams,
  PDFRenderTask,
  GlobalWorkerOptions,
  getDocument
} from 'pdfjs-dist';

import 'pdfjs-dist/web/pdf_viewer';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LsEditorField } from '../ls-editor-field/ls-editor-field';
import { findIn } from './editorCalculator';

GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js';

/**
 * The Legalesign page viewer converted to stencil. To use pass the standard
 * Template information from GraphQL (see Readme).
 * 
 * Alex Weinle
 */

@Component({
  tag: 'ls-editor',
  styleUrl: 'ls-editor.css',
  shadow: true,
})
export class LsEditor {
  @Element() component: HTMLElement;

  private isPageRendering: boolean;
  private selectionBox: { x: number, y: number } = null;
  private pdfDocument: any;
  private pageNumPending: number = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number = 1; // hardcoded to scale the document to full canvas size
  private pageNum: number = 1; // hardcoded to start at the page 1
  private hitField: HTMLElement;
  private edgeSide: string;
  private selected: LsEditorField[];
  private startMouse: { left: number, top: number, height: number, width: number, x: number, y: number };
  //
  // --- Properties / Inputs --- //
  //

  /**
   * The initial template data, including the link for background PDF. See README and
   * example for correct GraphQL query and data structure.
   * {LSApiTemplate}
   */
  @Prop() template: LSApiTemplate;

  /**
   * Whether the left hand toolbox is displayed.
   * {boolean}
   */
  @Prop() showtoolbox?: boolean = false;

    /**
   * Allows you to change the colours used for each role in the template.
   * {SignerColor[]}
   */
  @Prop() roleColors?: RoleColor[] = defaultPalette;


  /**
   * Listen for changes to src
   * @param newValue
   * @param oldValue
   */

  @Watch('src')
  doSrc(newValue: string | null, oldValue: string | null): void {
    if (newValue === oldValue) {
      return;
    }
    // this.loadAndRender(newValue);
  }

  //
  // --- Event Emitters --- //
  //
  @Event() pageRendered: EventEmitter<number>;
  // @Event() error: EventEmitter<any>;
  @Event() pageChange: EventEmitter<number>;
  // Multiple or single select
  @Event() onSelect: EventEmitter<LSApiElement[]>;

  //
  // --- Methods --- //
  //

  /**
   * Page forward
   * {MouseEvent} e
   */
  @Method()
  async pageNext(e: MouseEvent) {
    e.preventDefault();

    if (this.pageNum >= this.pdfDocument.numPages) {
      return;
    }
    this.pageNum += 1;
    this.queueRenderPage(this.pageNum);
  }

  /**
   * Page backward
   * e
   */
  @Method()
  async pagePrev(e: MouseEvent) {
    e.preventDefault();

    if (this.pageNum <= 1) {
      return;
    }

    this.pageNum -= 1;
    this.queueRenderPage(this.pageNum);
  }

  /**
   * Render the page based on pageNumber
   * {number} pageNumber
   */
  renderPage(pageNumber: number): void {
    this.isPageRendering = true;

    this.pdfDocument
      .getPage(pageNumber)
      .then(
        (page: PDFPageProxy) => {
          const viewport: PDFPageViewport = page.getViewport({ scale: this.scale, rotation: 0 });
          this.canvas.height = viewport.height;
          this.canvas.width = viewport.width;

          // Render PDF page into canvas context
          const renderContext: PDFRenderParams = {
            viewport,
            canvasContext: this.ctx
          };

          // Render page method
          const renderTask: PDFRenderTask = page.render(renderContext);

          // Wait for rendering to finish
          renderTask.promise
            .then(
              () => {
                this.isPageRendering = false;
                this.pageRendered.emit(this.pageNum);

                if (this.pageNumPending !== null) {
                  this.renderPage(this.pageNumPending); // New page rendering is pending
                  this.pageChange.emit(this.pageNumPending); // emit
                  this.pageNumPending = null;

                }
              }
            );
        }
      );
  }

  private queueRenderPage(pageNumber: number): void {
    if (this.isPageRendering) {
      this.pageNumPending = pageNumber;
    } else {
      this.renderPage(pageNumber);
    }
  }


  private loadAndRender(src: string): void {
    getDocument(src).promise
      .then((pdfDocument: PDFDocumentProxy) => {
        this.pdfDocument = pdfDocument;
        this.renderPage(this.pageNum);
      });
  }

  /**
 * The intial data for the template.
 */
  @Prop() initialData: object;

  componentDidLoad() {
    PDFDocument.create().then(pdfDoc => {
      const page = pdfDoc.addPage([842, 595]);
      page.moveTo(50, 410);
      page.drawText('Welcome to Legalesign!');
      pdfDoc.saveAsBase64({ dataUri: true }).then(pdfDataUri => {
        this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
        this.canvas.style.height = "842px"
        this.canvas.style.width = "595px"
        this.ctx = this.canvas.getContext('2d');
        this.loadAndRender(pdfDataUri);
      });
    });

    var dropTarget = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLCanvasElement;

    dropTarget.addEventListener("mousedown", (e) => {

      if (e.offsetX < 0 || e.offsetY < 0) return;

      // Find if this was
      // - a hit on a field edge RESIZE
      // - a hit on the middle of a field MOVE
      // - a hit on the background document SELECTMULTIPLE with a box
      this.hitField = null;
      const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');

      fields.forEach(f => {
        const { left, top, height, width, bottom, right } = f.getBoundingClientRect();
        const fdims = { left: f.offsetLeft, top: f.offsetTop, height, width, x: e.screenX, y: e.screenY }
        this.startMouse = fdims;
        // west edge
        if (Math.abs(e.clientX - left) < 5 && e.clientY >= top && e.clientY <= bottom) {
          this.edgeSide = "w"
          this.hitField = f;
          // right / east edge
        } else if (Math.abs(e.clientX - right) < 5 && e.clientY >= top && e.clientY <= bottom) {
          this.edgeSide = "e"
          this.hitField = f;
          // north edge
        } else if (Math.abs(e.clientY - top) < 5 && e.clientX >= left && e.clientX <= right) {
          this.edgeSide = "n"
          this.hitField = f;
          // south edge
        } else if (Math.abs(e.clientY - bottom) < 5 && e.clientX >= left && e.clientX <= right) {
          this.edgeSide = "s"
          this.hitField = f;
        } else if (e.clientY <= bottom && e.clientY >= top && e.clientX >= left && e.clientX <= right) {
          this.edgeSide = null
          this.hitField = f

        }
      })

      if (this.hitField) {
        const { height, width } = this.hitField.getBoundingClientRect();
        const fdims = { left: this.hitField.offsetLeft, top: this.hitField.offsetTop, height, width, x: e.screenX, y: e.screenY }
        this.startMouse = fdims;
      } else {
        this.selectionBox = { x: e.clientX, y: e.clientY }
        this.component.style.cursor = "crosshair"
      }
    })

    dropTarget.addEventListener("mousemove", (event) => {
      event.preventDefault();
      // We have the mouse held down on a field edge to resize it.
      if (this.hitField && this.edgeSide && this.startMouse) {
        const movedX = (event.screenX - this.startMouse.x);
        const movedY = (event.screenY - this.startMouse.y);

        switch (this.edgeSide) {
          case "n":
            this.hitField.style.top = (this.startMouse.top + movedY) + "px"
            this.hitField.style.height = (this.startMouse.height - movedY) + "px"
            break;
          case "s":
            this.hitField.style.height = this.startMouse.height + movedY + "px"
            break;
          case "e":
            this.hitField.style.width = (this.startMouse.width + movedX) + "px"
            break;
          case "w":
            this.hitField.style.left = (this.startMouse.left + movedX) + "px"
            this.hitField.style.width = (this.startMouse.width - movedX) + "px"
            break;
        }
      } else if (this.selectionBox) {
        // draw the multiple selection box
        var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
        var frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
        var leftOffset = frame.getBoundingClientRect().left
        const movedX = (event.clientX - this.selectionBox.x);
        const movedY = (event.clientY - this.selectionBox.y);

        box.style.visibility = "visible"
        box.style.left = (this.selectionBox.x > event.clientX ? event.clientX : this.selectionBox.x) - leftOffset + "px"
        box.style.top = (this.selectionBox.y > event.clientY ? event.clientY : this.selectionBox.y) + "px"
        box.style.width = Math.abs(movedX) + "px"
        box.style.height = Math.abs(movedY) + "px"

      }
    });

    dropTarget.addEventListener("mouseup", (_event) => {
      this.edgeSide = null;
      this.hitField = null;
      this.startMouse = null;
      this.component.style.cursor = "auto"

      // find what was inside the selection box emit the onSelect event and change their style
      if (this.selectionBox) {
        var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
        var fields = this.component.shadowRoot.querySelectorAll('ls-editor-field')
        box.style.visibility = "hidden"

        const hits = findIn(fields, box, true)

        this.onSelect.emit(hits.map(f => f.dataItem))
        this.selectionBox = null
      }
    });

    dropTarget.addEventListener("dragenter", (event) => {
      event.preventDefault();
    });

    dropTarget.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    dropTarget.addEventListener("drop", (event) => {
      event.preventDefault();
      console.log("drop ls-editor", event);

      try {
        const data: IToolboxField = JSON.parse(event.dataTransfer.getData("application/json")) as any as IToolboxField;

        const doc = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLCanvasElement;
        const node = document.createElement("ls-editor-field");
        node.setAttribute("type", data.type)
        node.setAttribute("value", "")
        node.style.zIndex = "100";
        node.style.position = "absolute";

        node.style.top = event.offsetY.toString() + "px";
        node.style.left = (event.offsetX).toString() + "px";
        node.style.height = data.defaultHeight.toString() + "px";
        node.style.width = data.defaultWidth.toString() + "px";
        doc.appendChild(node);

      } catch (e) {
        console.log(e)
      }
    });
  }



  render() {
    return (
      <Host>
        {this.showtoolbox === true ? <div class="leftBox">
          <div class="ls-editor-infobox">Drag to Add...</div>
          <ls-toolbox-field type="signature" label="Signature" defaultHeight={27} defaultWidth={120} />
          <ls-toolbox-field type="text" label="Text" defaultHeight={27} defaultWidth={320} />
          <ls-toolbox-field type="number" label="Number" defaultHeight={27} defaultWidth={120} />
          <ls-toolbox-field type="date" label="Date" defaultHeight={27} defaultWidth={120} />
          <ls-toolbox-field type="checkbox" label="Checkbox" defaultHeight={27} defaultWidth={27} />
          <ls-toolbox-field type="autosign" label="My Signature" defaultHeight={27} defaultWidth={120} />
          <ls-toolbox-field type="regex" label="Regex" defaultHeight={27} defaultWidth={120} />
          <ls-toolbox-field type="image" label="Image" defaultHeight={27} defaultWidth={120} />
          <ls-toolbox-field type="autodate" label="Autodate" defaultHeight={27} defaultWidth={120} />
          <ls-toolbox-field type="file" label="File" defaultHeight={27} defaultWidth={120} />
        </div>
          :
          <></>
        }
        <div id="ls-document-frame" >
          <canvas id="pdf-canvas" >       </canvas>
          <div id="ls-box-selector"></div>
        </div>
        <div class="rightBox">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
