import { Component, Host, Prop, h, Element, Method, State, Listen, Watch } from '@stencil/core';
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
import { addField, findDimensions, findIn, moveField } from './editorCalculator';
import { defaultRolePalette } from './defaultPalette';
import { LSMutateEvent } from '../../types/LSMutateEvent';

GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js';

/**
 * The Legalesign page viewer converted to stencil. To use pass the standard
 * Template information from GraphQL (see Readme).
 * 
 * Alex Weinle
 */

@Component({
  tag: 'ls-document-viewer',
  styleUrl: 'ls-document-viewer.css',
  shadow: true,
})
export class LsDocumentViewer {
  @Element() component: HTMLElement;

  private isPageRendering: boolean;
  private isMoving: boolean = false;
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
  @State() selected: HTMLLsEditorFieldElement[];


  /**
 * An ease of use property that will arrange document-viewer appropraitely.
 * {'preview' | 'editor' | 'custom'}
 */
  @Prop() mode: 'preview' | 'editor' | 'custom' = 'custom';

  // Updates are internal event between LS controls not to be confused with mutate
  @Watch('mode')
  modeHandler(_newMode, _oldMode) {
    if (_newMode === 'preview') {
      this.showtoolbar = false;
      this.showtoolbox = false;
      this.showstatusbar = false;
      this.showrightpanel = false;
      this.readonly = true;
    } else if (_newMode === 'editor') {
      this.showtoolbar = true;
      this.showtoolbox = true;
      this.showstatusbar = true;
      this.showrightpanel = true;
      this.readonly = false;
    }

  }

  /**
  * Determines / sets which of the far left 'managers' is active.
  * {'document' | 'toolbox' | 'participant' }
  */
  @Prop({ mutable: true }) manager: 'document' | 'toolbox' | 'participant' = 'toolbox';


  @Watch('selected')
  selectedHandler(newSelected, _oldSelected) {
    var toolbar = this.component.shadowRoot.getElementById('ls-toolbar') as HTMLLsToolbarElement;
    toolbar.dataItem = newSelected
  }

  /**
   * Whether the left hand toolbox is displayed.
   * {boolean}
   */
  @Prop() showtoolbox?: boolean = false;

  /**
   * Whether the top toolbar is displayed.
   * {boolean}
   */
  @Prop() showtoolbar?: boolean = false;

  /**
   * Whether the bottom statusbar is displayed.
   * {boolean}
   */
  @Prop() showstatusbar?: boolean = false;

  /**
 * Whether the page previewvertical ribbon will be shown
 * {boolean}
 */
  @Prop() showpagepreview?: boolean = false;

  /**
* Whether the right panel (which can be default field properties or custom panel) is
* displayed.
* {boolean}
*/
  @Prop() showrightpanel?: boolean = false;

  /**
* Whether the right panel (which can be default field properties or custom panel) is
* displayed.
* {boolean}
*/
  @Prop() readonly?: boolean = false;

  /**
* Whether the table view of the fields on this template is available to the user.
* {boolean}
*/
  @Prop() showtableview?: boolean = false;

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
  @Event() selectFields: EventEmitter<LSApiElement[]>;
  // Send an external event to be processed
  @Event() mutate: EventEmitter<LSMutateEvent[]>;
  // Send an internal event to be processed
  @Event() update: EventEmitter<LSMutateEvent[]>;

  // Updates are internal event between LS controls not to be confused with mutate
  @Listen('update')
  mutateHandler(event: CustomEvent<LSMutateEvent[]>) {
    if (event.detail) event.detail.forEach(fx => this.syncChange(fx))
  }

  handleKeyDown(ev: KeyboardEvent){
    if(this.selected?.length > 0) {
      console.log(ev)
      if (ev.key === 'ArrowDown'){
        console.log('down arrow pressed')
        this.alter((original) => (original.top < this.pageDimensions[original.page].height) ? original.top +1 : this.pageDimensions[original.page].height)
      } else     if (ev.key === 'ArrowUp'){
        console.log('up arrow pressed')
         this.alter((original) => original.top > 0 ? original.top -1 : 0)
      } else     if (ev.key === 'ArrowRight'){
        console.log('right arrow pressed')
      } else     if (ev.key === 'ArrowLeft'){
        console.log('left arrow pressed')
      }
    }
  }

    // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diffFn) {

    const diffs: LSMutateEvent[] = this.selected.map(c => {
      return { action: "update", data: diffFn(c) as LSApiElement }
    })
    this.mutate.emit(diffs)
    this.update.emit(diffs)
  }

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
      top: Math.floor(newElement.ay * this.pageDimensions[newElement.page - 1].height),
      left: Math.floor(newElement.ax * this.pageDimensions[newElement.page - 1].width),
      height: Math.floor((newElement.by - newElement.ay) * this.pageDimensions[newElement.page - 1].height),
      width: Math.floor((newElement.bx - newElement.ax) * this.pageDimensions[newElement.page - 1].width),
      pageDimensions: this.pageDimensions[newElement.page - 1]
    }
  }

  // internal forced change
  syncChange(update: LSMutateEvent) {
    if (update.action === 'create') {
      addField(this.component.shadowRoot.getElementById('ls-document-frame'), update.data)
      const newField = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement

      this.selected = [newField]
      this.selectFields.emit([update.data])
    }
    else if (update.action === 'update') {
      const fi = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;
      if (fi) {
        var newItem = { ...fi.dataItem, ...update.data }
        moveField(fi, newItem)
        fi.dataItem = newItem;
      }
      // Reselect the fields - this updates the dataItem value passed to child controls
      const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');      
      this.selected = Array.from(fields).filter(fx => fx.selected)
           
    } else if (update.action === 'delete') {
      const fi = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;
      this.component.shadowRoot.getElementById('ls-document-frame').removeChild(fi)
    } else {
      console.warn('Unrecognised action, check Legalesign documentation. `create`, `update` and `delete` allowed.')
    }
  }

  componentDidLoad() {
    // TODO:: Remove and add "real" background
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
      // check we're not moving fields
      if (this.isMoving) {
        // End dragging fields
        this.isMoving = false
        const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
        const selected = Array.from(fields).filter(fx => fx.selected)

        this.selectFields.emit(selected.map(fx => fx.dataItem))
        this.mutate.emit(Array.from(fields).filter(fx => fx.selected).map(fx => {
          // Calculate new positions and update the dataItem on the control
          const delta = {
            ...fx.dataItem,
            ...findDimensions(fx, this.pageDimensions[this.pageNum - 1].height, this.pageDimensions[this.pageNum - 1].width)
          }
          fx.dataItem = delta
          return { action: "update", data: delta }
        }))
      } else {
        const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
        fields.forEach(f => {
          const { left, top, bottom, right } = f.getBoundingClientRect();
          if (e.clientY <= bottom && e.clientY >= top && e.clientX >= left && e.clientX <= right) {
            this.edgeSide = null
            this.hitField = f
            // check if this is a shift click to add to the current selection
            if (!e.shiftKey) fields.forEach(ft => ft.selected = false)
            f.selected = true
          }
        })

        this.selected = Array.from(fields).filter(fx => fx.selected)
        this.selectFields.emit(this.selected.map(fx => fx.dataItem))

      }
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
        const target = this.selected ? this.selected : [this.hitField]
        this.startLocations = target.map(f => {
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
      if (this.hitField && this.edgeSide && this.startMouse && event.buttons === 1) {
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
      } else if (this.selectionBox && event.buttons === 1) {
        // draw the multiple selection box
        var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
        var frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
        var leftOffset = frame.getBoundingClientRect().left
        var topOffset = frame.getBoundingClientRect().top
        const movedX = (event.clientX - this.selectionBox.x);
        const movedY = (event.clientY - this.selectionBox.y);

        box.style.visibility = "visible"
        box.style.left = (this.selectionBox.x > event.clientX ? event.clientX : this.selectionBox.x) - leftOffset + "px"
        box.style.top = (this.selectionBox.y > event.clientY ? event.clientY : this.selectionBox.y) - topOffset + "px"
        box.style.width = Math.abs(movedX) + "px"
        box.style.height = Math.abs(movedY) + "px"

      } else if (this.startLocations && !this.edgeSide && this.startMouse && event.buttons === 1) {
        this.isMoving = true;
        // Move one or more selected items
        const movedX = (event.screenX - this.startMouse.x);
        const movedY = (event.screenY - this.startMouse.y);
        if (this.selected?.length) {
          for (let i = 0; i < this.selected.length; i++) {
            this.selected[i].style.left = (this.startLocations[i].left + movedX) + "px"
            this.selected[i].style.top = (this.startLocations[i].top + movedY) + "px"
          }
        }
      }
    });

    dropTarget.addEventListener("mouseup", (event) => {
      this.edgeSide = null;
      this.startMouse = null;
      this.component.style.cursor = "auto"

      // find what was inside the selection box emit the select event and change their style
      if (this.selectionBox) {
        var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
        var fields = this.component.shadowRoot.querySelectorAll('ls-editor-field')
        box.style.visibility = "hidden"

        findIn(fields, box, true, event.shiftKey)

        this.selectFields.emit(Array.from(fields).filter(fx => fx.selected).map(fx => fx.dataItem))
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
        const newData: LSMutateEvent = {
          action: 'create', data: {
            ...data,
            id,
            value: "",
            top: event.offsetY,
            left: event.offsetX,
            height: data.defaultHeight,
            width: data.defaultWidth,
            fontName: "courier",
            fontSize: 10,
            align: 'left',
            signer: 1,
            elementType: data.type
          } as LSApiElement
        }

        // TODO :: work out a sensible defaults system for this
        this.mutate.emit([newData])
        this.update.emit([newData])

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

    document.addEventListener("keydown", this.handleKeyDown)

  }

  componentWillLoad() {
    if (this.template) {
      this.parseTemplate(this.template);
    }
  }

  render() {
    return (
      <Host>
        <form id="ls-editor-form">
          {this.showtoolbox === true ? <div class="leftBox">
            <ls-feature-column onManage={(manager) => {
              console.log(manager)

              if (manager.detail === 'document') {
                var documentManager = this.component.shadowRoot.getElementById('ls-document-options') as HTMLLsDocumentOptionsElement;
                documentManager.template = this._template
              } else if (manager.detail === 'participant') {
                console.log(this._template)
                var participantManager = this.component.shadowRoot.getElementById('ls-participant-manager') as HTMLLsParticipantManagerElement;
                participantManager.template = this._template
              }
              this.manager = manager.detail
            }} />
            <div id="ls-toolbox" class={this.manager === 'toolbox' ? 'toolbox' : 'hidden'}>
              <div class="ls-editor-infobox">Drag to Add...</div>
              <ls-toolbox-field elementType="signature" formElementType="signature" label="Signature" defaultHeight={27} defaultWidth={120} validation={0} />
              <ls-toolbox-field elementType="text" formElementType="text" label="Text" defaultHeight={27} defaultWidth={100} validation={0} />
              <ls-toolbox-field elementType="email" formElementType="email" label="Email" defaultHeight={27} defaultWidth={120} validation={1} />
              <ls-toolbox-field elementType="number" formElementType="number" label="Number" defaultHeight={27} defaultWidth={80} validation={50} />
              <ls-toolbox-field elementType="date" formElementType="date" label="Date" defaultHeight={27} defaultWidth={80} validation={2} />
              <ls-toolbox-field elementType="checkbox" formElementType="checkbox" label="Checkbox" defaultHeight={27} defaultWidth={27} validation={25} />
              <ls-toolbox-field elementType="auto sign" formElementType="auto sign" label="Auto Sign" defaultHeight={27} defaultWidth={120} validation={3000} />
              <ls-toolbox-field elementType="initials" formElementType="initials" label="Initials" defaultHeight={27} defaultWidth={120} validation={2000} />
              <ls-toolbox-field elementType="regex" formElementType="regex" label="Regex" defaultHeight={27} defaultWidth={120} validation={93} />
              <ls-toolbox-field elementType="image" formElementType="image" label="Image" defaultHeight={27} defaultWidth={120} validation={90} />
              <ls-toolbox-field elementType="signing date" formElementType="signing date" label="Signing Date" defaultHeight={27} defaultWidth={120} validation={30} />
              <ls-toolbox-field elementType="file" formElementType="file" label="File" defaultHeight={27} defaultWidth={120} validation={74} />
            </div>
            <ls-participant-manager id="ls-participant-manager" class={this.manager === 'participant' ? 'toolbox' : 'hidden'} />
            <ls-document-options id="ls-document-options" class={this.manager === 'document' ? 'toolbox' : 'hidden'} />
          </div>
            :
            <></>
          }
          <div id="ls-mid-area">
            <ls-toolbar id="ls-toolbar" dataItem={this.selected ? this.selected.map(s => s.dataItem) : null}/>
            <div id="ls-document-frame">
              <canvas id="pdf-canvas"></canvas>
              <div id="ls-box-selector"></div>
              {(this._template && this.pageDimensions && this._template.elementConnection.templateElements.map(e => <ls-editor-field id={"ls-field-" + e.id}
                page={this.pageDimensions[this.pageNum - 1]}
                type={e.formElementType}
                readonly={this.readonly}
                palette={this.roleColors}
                dataItem={this.prepareElement(e)} />))}

            </div>
            <ls-statusbar />
          </div>
          {this.showrightpanel && this.selected && this.selected.length > 0 && <div class="rightBox">
            <slot></slot>
          </div>}
        </form>
      </Host>
    );
  }
}
