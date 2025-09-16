import { Component, Host, Prop, h, Element, Method, State, Listen, Watch } from '@stencil/core';
import { Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement'
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
import { addField, moveField } from './editorCalculator';
import { defaultRolePalette } from './defaultPalette';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { keyDown } from './keyHandlers';
import { mouseClick, mouseDown, mouseMove, mouseUp } from './mouseHandlers';
import { getApiType } from './editorUtils';
import { RoleColor } from '../../types/RoleColor';

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
  private pdfDocument: any;
  private pageNumPending: number = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public pageDimensions: { height: number, width: number }[]; // hardcoded to start at the page 1
  // @ts-ignore
  private isMoving: boolean = false;
  // @ts-ignore
  private selectionBox: { x: number, y: number } = null;
  // @ts-ignore
  private hitField: HTMLElement;
  // @ts-ignore
  private edgeSide: string;
  // @ts-ignore
  private startLocations: { left: number, top: number, height: number, width: number }[];
  // @ts-ignore
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
  @Prop({ mutable: true }) zoom: number = 1.0; // hardcoded to scale the document to full canvas size
  @Prop({ mutable: true }) pageNum: number = 1; // hardcoded to start at the page 1

  @State() _template: LSApiTemplate
  @State() selected: HTMLLsEditorFieldElement[];


  /**
 * An ease of use property that will arrange document-viewer appropraitely.
 * {'preview' | 'editor' | 'custom'}
 */
  @Prop() mode: 'preview' | 'editor' | 'custom' = 'custom';

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

  @Watch('displayTable')
  tableViewHandler(_newMode, _oldMode) {
    if (_newMode === true) {
      this.showPageFields(-1)
    } else if (_newMode === 'editor') {
      this.showPageFields(this.pageNum)
    }
    this.queueRenderPage(this.pageNum);


  }

  /**
  * Determines / sets which of the far left 'managers' is active.
  * {'document' | 'toolbox' | 'participant' }
  */
  @Prop({ mutable: true }) manager: 'document' | 'toolbox' | 'participant' = 'toolbox';


  /**
  * Shows the table view of fields rather than the preview.
  * {boolean}
  */
  @Prop({ mutable: true }) displayTable?: boolean = false;

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
  updateHandler(event: CustomEvent<LSMutateEvent[]>) {
    if (event.detail) event.detail.forEach(fx => this.syncChange(fx))
  }

  // Send selection changes to bars and panels if in use.
  @Listen('selectFields')
  selectFieldsHandler(event: CustomEvent<LSApiElement[]>) {
    var toolbar = this.component.shadowRoot.getElementById('ls-toolbar') as HTMLLsToolbarElement;
    if (toolbar) toolbar.dataItem = event.detail as any as LSApiElement[]
    var propPanel = this.component.shadowRoot.getElementById('my-field-panel') as HTMLLsFieldPropertiesElement;
    if (propPanel) propPanel.dataItem = event.detail as any as LSApiElement[]
  }


  //
  // --- Methods --- //
  //

  /**
   * Page forward
   * {MouseEvent} e
   */
  @Method()
  async pageNext() {
    if (this.pageNum >= this.pdfDocument.numPages) {
      return;
    }
    this.pageNum += 1;
    this.queueRenderPage(this.pageNum);
    this.showPageFields(this.pageNum)
  }

  /**
   * Page backward
   * e
   */
  @Method()
  async pagePrev() {
    if (this.pageNum <= 1) {
      return;
    }

    this.pageNum -= 1;
    this.queueRenderPage(this.pageNum);
    this.showPageFields(this.pageNum)
  }

  /**
 * Page and field resize on zoom change
 * 
 */
  @Method()
  async setZoom(z: number) {
    console.log(z, 'setZoom')
    this.zoom = z
    this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;  
    this.canvas.style.height = this.pageDimensions[this.pageNum - 1].height * z + "px"
    this.canvas.style.width = this.pageDimensions[this.pageNum - 1].width * z + "px"

    // place all fields at new zoom level
    this.component.shadowRoot.querySelectorAll('ls-editor-field').forEach(fx => moveField.bind(this)(fx, fx.dataItem))

    console.log(this.zoom, 'rendering')
    this.queueRenderPage(this.pageNum)
    this.showPageFields(this.pageNum)
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
          console.log('viewport page ', page.getViewport())

          const viewport: PDFPageViewport = page.getViewport({ scale: this.zoom });
          this.canvas.height = Math.floor(viewport.height);
          this.canvas.width = Math.floor(viewport.width);

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
      console.log('rerender')
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

    if (getApiType(update.data) === 'element') {
      if (update.action === 'create') {
        const newData = { ...update.data, page: this.pageNum }
        addField.bind(this)(this.component.shadowRoot.getElementById('ls-document-frame'), newData)
        const newField = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement

        this.selected = [newField]
        this.selectFields.emit([newData as LSApiElement])
      }
      else if (update.action === 'update') {
        const fi = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;
        if (fi) {
          moveField.bind(this)(fi, update.data)
          const fu = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;

          fu.dataItem = update.data as LSApiElement;
          // Refresh the selected array
          this.selected = this.selected.map(s => s.dataItem.id === update.data.id ? fu : s)
        }
        // Reselect the fields - this updates the dataItem value passed to child controls
        const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
        this.selected = Array.from(fields).filter(fx => fx.selected)

      } else if (update.action === 'delete') {
        const fi = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;
        this.component.shadowRoot.getElementById('ls-document-frame').removeChild(fi)
        this.selected = []
      } else {
        console.warn('Unrecognised action, check Legalesign documentation. `create`, `update` and `delete` allowed.')
      }
    }
  }

  componentDidLoad() {    
    // Generate a canvas to draw the background PDF on.
    this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
    this.canvas.style.height = this.pageDimensions[this.pageNum - 1].height * this.zoom + "px"
    this.canvas.style.width = this.pageDimensions[this.pageNum - 1].width * this.zoom + "px"
    this.ctx = this.canvas.getContext('2d');
    this.loadAndRender(this._template.link)

    var dropTarget = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLCanvasElement;

    // Used for single field selection
    dropTarget.addEventListener("click", mouseClick.bind(this))
    dropTarget.addEventListener("mousedown", mouseDown.bind(this))
    dropTarget.addEventListener("mousemove", mouseMove.bind(this))
    dropTarget.addEventListener("mouseup", mouseUp.bind(this))
    document.addEventListener("keydown", keyDown.bind(this))
    dropTarget.addEventListener("dragenter", (event) => { event.preventDefault(); })
    dropTarget.addEventListener("dragover", (event) => { event.preventDefault(); })
    dropTarget.addEventListener("drop", (event) => {
      event.preventDefault();
      try {
        const data: IToolboxField = JSON.parse(event.dataTransfer.getData("application/json")) as any as IToolboxField;
        this.component.shadowRoot.querySelectorAll('ls-editor-field').forEach(f => f.selected = false)
        var frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
        // Make a new API compatible id for a template element (prefix 'ele')
        const id = btoa('ele' + crypto.randomUUID())
        // TODO: Put these defaults somewhere sensible
        const newData: LSMutateEvent = {
          action: 'create', data: {
            ...data,
            id,
            value: "",
            top: event.offsetY * this.zoom + frame.scrollTop,
            left: event.offsetX * this.zoom + frame.scrollLeft,
            height: data.defaultHeight,
            width: data.defaultWidth,
            pageDimensions: this.pageDimensions[this.pageNum - 1],
            fontName: "courier",
            fontSize: 10,
            align: 'left',
            signer: 1,
            elementType: data.type
          } as LSApiElement
        }

        this.mutate.emit([newData])
        this.update.emit([newData])

      } catch (e) {
        console.error(e)
      }
    })

    // Generate all the field HTML elements that are required (for every page)
    this._template.elementConnection.templateElements.forEach(te => {
      addField.bind(this)(this.component.shadowRoot.getElementById('ls-document-frame'), this.prepareElement(te))
    })


  }

  showPageFields(page: number) {

    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    Array.from(fields).forEach(fx => {
      fx.className = fx.dataItem.page === page ? '' : 'hidden'
    })

  }

  componentWillLoad() {
    if (this.template) this.parseTemplate(this.template);
  }

  render() {
    return (
      <Host>
        <form id="ls-editor-form">
          {this.showtoolbox === true ? <div class="leftBox">
            <ls-feature-column onManage={(manager) => {
              if (manager.detail === 'document') {
                var documentManager = this.component.shadowRoot.getElementById('ls-document-options') as HTMLLsDocumentOptionsElement;
                documentManager.template = this._template
              } else if (manager.detail === 'participant') {
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
            <ls-participant-manager id="ls-participant-manager" class={this.manager === 'participant' ? 'toolbox' : 'hidden'} editor={this} />
            <ls-document-options id="ls-document-options" class={this.manager === 'document' ? 'toolbox' : 'hidden'} />
          </div>
            :
            <></>
          }
          <div id="ls-mid-area">
            <ls-toolbar id="ls-toolbar" dataItem={this.selected ? this.selected.map(s => s.dataItem) : null} template={this._template} />
            <div id="ls-document-frame">
              <canvas id="pdf-canvas" class={this.displayTable ? 'hidden' : ''}></canvas>
              <ls-editor-table editor={this} class={this.displayTable ? '' : 'hidden'} />
              <div id="ls-box-selector"></div>
            </div>
            <ls-statusbar editor={this} />
          </div>
          {this.showrightpanel && !this.displayTable && <div class={this.selected && this.selected.length > 0 ? 'rightBox' : 'hidden'}>
            <ls-field-properties id="my-field-panel"></ls-field-properties>
            <slot></slot>
          </div>}
        </form>
      </Host>
    );
  }
}
