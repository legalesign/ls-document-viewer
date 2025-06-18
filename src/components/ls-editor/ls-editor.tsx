import { Component, Host, Prop, Watch, h, Element, Method, State } from '@stencil/core';
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
import { addField, findIn } from './editorCalculator';
import { defaultRolePalette } from './defaultPalette';

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
  private pageDimensions: { height: number, width: number }[]; // hardcoded to start at the page 1
  private hitField: HTMLElement;
  private edgeSide: string;
  private selected: HTMLLsEditorFieldElement[];
  private startLocations: { left: number, top: number, height: number, width: number }[];
  private startMouse: { left: number, top: number, height: number, width: number, x: number, y: number };
  //
  // --- Properties / Inputs --- //
  //

  /**
   * The initial template data, including the link for background PDF. See README and
   * example for correct GraphQL query and data structure.
   * {LSApiTemplate}
   */
  @Prop() template: string;
  @State() _template: LSApiTemplate

  /**
   * Whether the left hand toolbox is displayed.
   * {boolean}
   */
  @Prop() showtoolbox?: boolean = false;

  /**
 * If supplied ONLY items in this | ("or") delimited list will be shown. i.e. "signature|intials"
 * {boolean}
 */
  @Prop() toolboxFilter?: string = null;

  /**
 * Allows you to change the colours used for each role in the template.
 * {SignerColor[]}
 */
  @Prop() roleColors?: RoleColor[] = defaultRolePalette;


  parseTemplate(newValue: string) {
    const newTemplate = newValue as any as LSApiTemplate
    const pages = JSON.parse(JSON.parse(newTemplate.pageDimensions))

    // Convert ax,bx,ay etc. into top, left
    this.pageDimensions = pages.map(p => { return { height: p[1], width: p[0] } })
    const fields = newTemplate.elementConnection.templateElements.map(f => {
      return {
        ...f,
        top: f.ay * pages[0].height,
        left: f.ax * pages[0].width,
        height: (f.by - f.ay) * pages[0].height,
        width: (f.bx - f.ax) * pages[0].width
      }
    })
    this._template = { ...newTemplate, elementConnection: { ...newTemplate.elementConnection, templateElements: fields } }
  }

  //
  // --- Event Emitters --- //
  //
  @Event() pageRendered: EventEmitter<number>;
  // @Event() error: EventEmitter<any>;
  @Event() pageChange: EventEmitter<number>;
  // Multiple or single select
  @Event() onSelect: EventEmitter<LSApiElement[]>;
  // Multiple or single change
  @Event() onChange: EventEmitter<LSApiElement[]>;

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

  // Fills in and converts all utility and placement fields
  prepareElement(newElement: LSApiElement): LSApiElement {
    return {
      ...newElement,
      top: Math.floor(newElement.ay * this.pageDimensions[this.pageNum - 1].height),
      left: Math.floor(newElement.ax * this.pageDimensions[this.pageNum - 1].width),
      height: Math.floor((newElement.by - newElement.ay) * this.pageDimensions[this.pageNum - 1].height),
      width: Math.floor((newElement.bx - newElement.ax) * this.pageDimensions[this.pageNum - 1].width)
    }
  }

  componentDidLoad() {
    PDFDocument.create().then(pdfDoc => {
      const page = pdfDoc.addPage([842, 595]);
      page.moveTo(50, 410);
      page.drawText('Welcome to Legalesign!');
      pdfDoc.saveAsBase64({ dataUri: true }).then(pdfDataUri => {
        this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
        this.canvas.style.height = this.pageDimensions[this.pageNum - 1].height + "px"
        this.canvas.style.width = this.pageDimensions[this.pageNum - 1].width + "px"
        this.ctx = this.canvas.getContext('2d');
        this.loadAndRender(pdfDataUri);
      });
    });

    var dropTarget = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLCanvasElement;

    // Used for single field selection
    dropTarget.addEventListener("click", (e) => {

      const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
      fields.forEach(f => {
        const { left, top, bottom, right } = f.getBoundingClientRect();
        if (e.clientY <= bottom && e.clientY >= top && e.clientX >= left && e.clientX <= right) {
          this.edgeSide = null
          this.hitField = f
          // check if this is a shift click to add to the current selection
          if (!e.shiftKey) fields.forEach(ft => ft.selected = false)
          f.selected = true

          this.selected = Array.from(fields).filter(fx => fx.selected)
          this.onSelect.emit(Array.from(fields).filter(fx => fx.selected).map(fx => fx.dataItem))

        }
      })
    })

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
          this.hitField = f;
        }
      })

      if (this.hitField) {
        const { height, width } = this.hitField.getBoundingClientRect();
        const fdims = { left: this.hitField.offsetLeft, top: this.hitField.offsetTop, height, width, x: e.screenX, y: e.screenY }
        this.startMouse = fdims;
        this.startLocations = this.selected.map(f => {
          const { height, width } = f.getBoundingClientRect();
          const beHtml = f as HTMLElement
          return { top: beHtml.offsetTop, left: beHtml.offsetLeft, height, width }
        })
        this.selectionBox = null;
      } else {
        this.startLocations = null
        this.startMouse = null
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

      } else if (this.startLocations && !this.edgeSide && this.startMouse) {
        // Move one or more selected items
        const movedX = (event.screenX - this.startMouse.x);
        const movedY = (event.screenY - this.startMouse.y);

        for (let i = 0; i < this.selected.length; i++) {
          this.selected[i].style.left = (this.startLocations[i].left + movedX) + "px"
          this.selected[i].style.top = (this.startLocations[i].top + movedY) + "px"
        }

      }
    });

    dropTarget.addEventListener("mouseup", (event) => {
      this.edgeSide = null;
      this.hitField = null;
      this.startMouse = null;
      this.component.style.cursor = "auto"

      // find what was inside the selection box emit the onSelect event and change their style
      if (this.selectionBox) {
        var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
        var fields = this.component.shadowRoot.querySelectorAll('ls-editor-field')
        box.style.visibility = "hidden"

        findIn(fields, box, true, event.shiftKey)

        this.onSelect.emit(Array.from(fields).filter(fx => fx.selected).map(fx => fx.dataItem))
        this.selectionBox = null
        this.selected = Array.from(fields).filter(fx => fx.selected)
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

      try {
        const data: IToolboxField = JSON.parse(event.dataTransfer.getData("application/json")) as any as IToolboxField;

        this.component.shadowRoot.querySelectorAll('ls-editor-field').forEach(f => f.selected = false)
        const id = crypto.randomUUID()

        // TODO :: work out a sensible defaults system for this
        const addedField = addField(this.component.shadowRoot.getElementById('ls-document-frame'), {
          ...data,
          id,
          value: "",
          top: event.offsetY,
          left: event.offsetX,
          height: data.defaultHeight,
          width: data.defaultWidth,
          fontName: "courier",
          fontSize: 10,
          align: 'left'
        })

        const newField = this.component.shadowRoot.getElementById('ls-field-' + id) as HTMLLsEditorFieldElement
        this.onSelect.emit([newField.dataItem])
        this.selected = [addedField]

      } catch (e) {
        console.log(e)
      }
    });

    this._template.elementConnection.templateElements.forEach(te => {
      const fte = this.component.shadowRoot.getElementById('ls-field-' + te.id)
      if (fte) {
        fte.style.top = te.ay * this.pageDimensions[this.pageNum - 1].height + "px"
        fte.style.left = te.ax * this.pageDimensions[this.pageNum - 1].width + "px"
        fte.style.height = (te.by - te.ay) * this.pageDimensions[this.pageNum - 1].height + "px"
        fte.style.width = (te.bx - te.ax) * this.pageDimensions[this.pageNum - 1].width + "px"
        fte.style.fontSize = te.fontSize + "px"
        fte.style.fontFamily = te.fontName
      }

    })

  }

  componentWillLoad() {
    if (this.template) this.parseTemplate(this.template);
  }

  render() {
    return (
      <Host>
        {this.showtoolbox === true ? <div class="leftBox">
          <div class="ls-editor-infobox">Drag to Add...</div>
          <ls-toolbox-field elementType="signature" formElementType="signature" label="Signature" defaultHeight={27} defaultWidth={120} validation={0} />
          <ls-toolbox-field elementType="text" formElementType="text" label="Text" defaultHeight={27} defaultWidth={320} validation={0} />
          <ls-toolbox-field elementType="email" formElementType="email" label="Email" defaultHeight={27} defaultWidth={320} validation={1} />
          <ls-toolbox-field elementType="number" formElementType="number" label="Number" defaultHeight={27} defaultWidth={120} validation={50} />
          <ls-toolbox-field elementType="date" formElementType="date" label="Date" defaultHeight={27} defaultWidth={120} validation={2} />
          <ls-toolbox-field elementType="checkbox" formElementType="checkbox" label="Checkbox" defaultHeight={27} defaultWidth={27} validation={25} />
          <ls-toolbox-field elementType="auto sign" formElementType="auto sign" label="Auto Sign" defaultHeight={27} defaultWidth={120} validation={3000} />
          <ls-toolbox-field elementType="initials" formElementType="initials" label="Auto Sign" defaultHeight={27} defaultWidth={120} validation={2000} />
          <ls-toolbox-field elementType="regex" formElementType="regex" label="Regex" defaultHeight={27} defaultWidth={120} validation={93} />
          <ls-toolbox-field elementType="image" formElementType="image" label="Image" defaultHeight={27} defaultWidth={120} validation={90} />
          <ls-toolbox-field elementType="signing date" formElementType="signing date" label="Signing Date" defaultHeight={27} defaultWidth={120} validation={30} />
          <ls-toolbox-field elementType="file" formElementType="file" label="File" defaultHeight={27} defaultWidth={120} validation={74} />
        </div>
          :
          <></>
        }
        <div id="ls-document-frame" >
          <canvas id="pdf-canvas"></canvas>
          <div id="ls-box-selector"></div>
          {(this._template && this.pageDimensions && this._template.elementConnection.templateElements.map(e => <ls-editor-field id={"ls-field-" + e.id}
            page={this.pageDimensions[this.pageNum - 1]}
            type={e.formElementType}
            dataItem={this.prepareElement(e)} />))}
        </div>
        <div class="rightBox">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
