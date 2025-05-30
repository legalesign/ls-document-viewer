import { Component, Host, Prop, Watch, h, Element, Method, Listen } from '@stencil/core';
import { Event, EventEmitter } from '@stencil/core';
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

GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js';

/**
 * The basic Legalesign page viewer converted to stencil. To use pass the standard
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
  private pdfDocument: any;
  private pageNumPending: number = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number = 1; // hardcoded to scale the document to full canvas size
  private pageNum: number = 1; // hardcoded to start at the page 1

  //
  // --- Properties / Inputs --- //
  //

  /**
   * Rotate the PDF in degrees
   * {number}
   */
  @Prop() rotation: 0 | 90 | 180 | 270 | 360 = 0;

  /**
   * Src of the PDF to load and render
   * {number}
   */
  @Prop() src?: string;

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
          const viewport: PDFPageViewport = page.getViewport({ scale: this.scale, rotation: this.rotation });
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
   * The template title
   */
  @Prop() templateTitle: string;

  /**
 * The intial data for the template.
 */
  @Prop() initialData: object;


  /**
   * The field change event. Bind this to a mutation.
   */
  @Event() fieldChange: EventEmitter<object>;

  todoCompletedHandler(field: object) {
    this.fieldChange.emit(field);
  }


  componentDidLoad() {
    PDFDocument.create().then(pdfDoc => {
      const page = pdfDoc.addPage([650, 600]);
      page.moveTo(50, 410);
      page.drawText('Welcome to Legalesign!');
      pdfDoc.saveAsBase64({ dataUri: true }).then(pdfDataUri => {
        this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        console.log(pdfDataUri)
        this.loadAndRender(pdfDataUri);
      });
    });


    var dropTarget = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLCanvasElement;

    dropTarget.addEventListener("dragenter", (event) => {
      event.preventDefault();
    });

    dropTarget.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    dropTarget.addEventListener("drop", (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("text/plain");
      const doc = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLCanvasElement;
      const node = document.createElement("div");
      node.style.zIndex = "1000";
      node.style.position = "absolute";
      node.style.border = "1px solid red";

      node.style.top = event.offsetY.toString() + "px";
      node.style.left = (event.offsetX).toString()  + "px";

      // node.style.top = "10px";
      // node.style.left = "10px";

      const textnode = document.createTextNode(data);
      node.appendChild(textnode);
      doc.appendChild(node);
      console.log(doc.clientTop, doc.clientWidth);
      console.log(event.clientY, event.clientX);
      console.log(event);
    });
  }

  handleDblClick(e) {
    console.log(e)
  }


  render() {
    return (
      <Host onDblClick={(e) => this.handleDblClick(e)}>
        <div class="leftBox">
          <ls-toolbox-field value="Signature" />
          <ls-toolbox-field value="Text" />
          <ls-toolbox-field value="Number" />
          <ls-toolbox-field value="Regex" />
          <ls-toolbox-field value="Date" />
          <ls-toolbox-field value="Autodate" />
          <ls-toolbox-field value="File" />
        </div>
        <div id="ls-document-frame" >       
        <canvas id="pdf-canvas" >       </canvas>
        </div>
        <div class="rightBox">
          Properties
        </div>
      </Host>
    );
  }
}
