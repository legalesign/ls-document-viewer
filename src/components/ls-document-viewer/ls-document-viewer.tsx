import { Component, Host, Prop, h, Element, Method, State, Listen, Watch } from '@stencil/core';
import { Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';
import { PDFDocumentProxy, PDFPageProxy, PageViewport, RenderTask, GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { addField, moveField } from './editorCalculator';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { keyDown } from './keyHandlers';
import { mouseClick, mouseDoubleClick, mouseDown, mouseDrop, mouseMove, mouseUp } from './mouseHandlers';
import { getApiType, matchData } from './editorUtils';
// import { RoleColor } from '../../types/RoleColor';
import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { LsDocumentAdapter } from './adapter/LsDocumentAdapter';
import { getTemplate } from './adapter/templateActions';
import { getGroupData } from './adapter/groupActions';
import { ValidationError } from '../../types/ValidationError';
import { validate } from './validator';
import { attachAllTooltips } from '../../utils/tooltip';
import { IToolboxField } from '../interfaces/IToolboxField';
import { generateRoles } from './generateRoles';

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.mjs`;

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
  public pageDimensions: { height: number; width: number }[]; // hardcoded to start at the page 1
  // @ts-ignore
  private isMoving: boolean = false;
  // @ts-ignore
  private isBoxing: boolean = false;
  // @ts-ignore
  private selectionBox: { x: number; y: number } = null;
  // @ts-ignore
  private hitField: HTMLElement;
  // @ts-ignore
  private edgeSide: string;
  // @ts-ignore
  private startLocations: { left: number; top: number; height: number; width: number }[];
  // @ts-ignore
  private startMouse: { left: number; top: number; height: number; width: number; x: number; y: number };

  //
  // --- Properties / Inputs --- //
  //

  /**
   * The initial template data, including the link for background PDF. See README and
   * example for correct GraphQL query and data structure.
   * {LSApiTemplate}
   */
  @Prop() template: string;

  /**
   * The access token of the account your want the widget to use, you should normally
   * acquire this with a server side call using that accounts login credentials.
   * {string}
   */
  @Prop() token: string;

  /**
   * This will override the default production user pool.
   * Almost exclusively used for internal development.
   * {string}
   */
  @Prop() userpool: string;

  /**
   * This will override the default production graphql endpoint.
   * Almost exclusively used for internal development.
   * {string}
   */
  @Prop() endpoint: string;

  /**
   * The id of the template you want to load (if using the internal data adapter).
   * {string}
   */
  @Prop() templateid: string;

  /**
   * A JSON string containing the recipient details. Only used in COMPOSE mode.
   * {string}
   */
  @Prop() recipients: string;
  @Prop() _recipients: any[];

  @Prop({ mutable: true }) zoom: number = 1.0; // hardcoded to scale the document to full canvas size
  @Prop({ mutable: true }) pageNum: number = 1;
  @Prop({ mutable: true }) pageCount: number = 1;
  @Prop({ mutable: true }) signer: number = 0;
  @Prop({ mutable: true }) groupInfo: any;

  @State() _template: LSApiTemplate;
  @State() validationErrors: ValidationError[] = [];
  @State() status: 'Valid' | 'Invalid' | 'Logged Out';
  @State() error: string | null = null;

  /**
   * The following state properties define the defaults for field
   * creation. They should be overridden by the users most used
   * values from localStorage or profile settings.
   */
  @State() fontSize: number = 10;
  @State() fontFamily: string = 'arial';
  @State() selected: HTMLLsEditorFieldElement[] = [];
  @State() isLoading: boolean = true;
  @State() selectedDataItems: LSApiElement[] = [];
  @State() fieldTypeSelected: IToolboxField = {
    label: 'Signature',
    formElementType: 'signature',
    elementType: 'signature',
    validation: 0,
    defaultHeight: 27,
    defaultWidth: 120,
  };

  /**
   * An ease of use property that will arrange document-viewer appropraitely.
   * {'preview' | 'editor' | 'custom'}
   */
  @Prop() mode: 'preview' | 'editor' | 'compose' = 'editor';

  @Watch('mode')
  modeHandler(_newMode, _oldMode) {
    if (_newMode === 'preview') {
      this.showstatusbar = false;
      this.readonly = true;
    } else if (_newMode === 'editor') {
      this.showstatusbar = true;
      this.readonly = false;
    } else if (_newMode === 'compose') {
      this.showstatusbar = true;
      this.readonly = false;
    }
  }

  @Watch('zoom')
  zoomChanged(newZoom: number) {
    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    fields.forEach(f => f.setAttribute('zoom', String(newZoom)));
  }

  /**
   * Determines / sets which of the far left 'managers' is active.
   * {'document' | 'toolbox' | 'participant' }
   */
  @Prop({ mutable: true }) manager: 'document' | 'toolbox' | 'participant' | 'recipient' | 'validation' = 'toolbox';

  /**
   * Shows the table view of fields rather than the preview.
   * {boolean}
   */
  @Prop({ mutable: true }) displayTable?: boolean = false;

  /**
   * Allows the selection of fields in the toolbox to be limited to a | (pipe) delimited list.
   * {string}
   */
  @Prop() filtertoolbox?: string = null;

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

  //
  // --- Event Emitters --- //
  //
  @Event() pageRendered: EventEmitter<number>;
  // @Event() error: EventEmitter<any>;
  @Event() pageChange: EventEmitter<number>;
  // Multiple or single select
  @Event() selectFields: EventEmitter<LSApiElement[]>;
  // Send an internal event to be processed
  @Event() mutate: EventEmitter<LSMutateEvent[]>;

  // Send an external event to be mmonitored by an external developer
  @Event() update: EventEmitter<{ event: LSMutateEvent; template: LSApiTemplate }>;

  // Send an external validation event to be monitored by an external developer
  @Event() validate: EventEmitter<{ valid: boolean }>;

  @Event({
    bubbles: true,
    composed: true,
  })
  addParticipant: EventEmitter<{ name?: string | null; type: LSApiRoleType; parent?: string | null; signerIndex?: number }>;

  private adapter: LsDocumentAdapter;

  // Action an external data action and use the result (if required)
  @Listen('mutate')
  mutateHandler(event: CustomEvent<LSMutateEvent[]>) {
    if (this.token && this.adapter)
      event.detail.forEach(me =>
        this.adapter
          .handleEvent(me, this.token)
          .then(result => matchData.bind(this)(result))
          .then(() => this.syncChange(me)),
      );
  }

  @Listen('fieldTypeSelected')
  handleFieldTypeSelected(event) {
    const fields = this.component.shadowRoot.querySelectorAll('ls-toolbox-field');

    fields.forEach(element => {
      element.isSelected = element.formElementType === event.detail.formElementType;
    });

    this.fieldTypeSelected = event.detail;
  }

  // generate a new role on the template
  @Listen('addParticipant')
  addParticpantHandler(event: CustomEvent<{ name: string | null; type: LSApiRoleType; parent?: string | null; signerIndex?: number }>) {
    const defaultExperience = this.groupInfo.experienceConnection.experiences.find(x => x.defaultExperience === true);
    const parent = event.detail.signerIndex > 99 ? this._template.roles.find(r => r.signerIndex === event.detail.signerIndex % 100) : null;
    const newSignerIndex =
      event.detail.type === 'WITNESS' ? parent.signerIndex + 100 : Math.max(...this._template.roles.filter(r => r.roleType !== 'WITNESS').map(r => r.signerIndex)) + 1;

    const data: LSMutateEvent[] = [
      {
        action: 'create',
        data: {
          id: btoa('rol' + crypto.randomUUID()),
          name: event.detail.name ? event.detail.name : 'Signer ' + (this._template.roles.length + 1),
          roleType: event.detail.type,
          signerIndex: event.detail.signerIndex
            ? event.detail.signerIndex
            : event.detail.type === 'WITNESS'
              ? 100 + parent?.signerIndex
              : this._template.roles.length === 0
                ? 1
                : newSignerIndex,
          ordinal: event.detail.type === 'WITNESS' ? parent?.ordinal + 1 : this._template.roles.length + 1,
          signerParent: event.detail.parent,
          experience: defaultExperience.id,
          templateId: this._template.id,
        },
      },
    ];
    this.mutate.emit(data);
  }

  // change the signer selected
  @Listen('changeSigner')
  updateSigner(event: CustomEvent<number>) {
    if (event.detail) {
      this.signer = event.detail;
    }
  }

  // Send selection changes to bars and panels if in use.
  @Listen('selectFields')
  selectFieldsHandler(event: CustomEvent<LSApiElement[]>) {
    const fields = Array.from(this.component.shadowRoot.querySelectorAll('ls-editor-field'));
    // update the template with all the latest values in the
    this._template = {
      ...this._template,
      elementConnection: { ...this._template.elementConnection, templateElements: fields.map(ef => ef.dataItem) },
    };

    var toolbar = this.component.shadowRoot.getElementById('ls-toolbar') as HTMLLsToolbarElement;
    if (toolbar) {
      toolbar.dataItem = event.detail as any as LSApiElement[];
    }
    if (event.detail.length === 0) {
      this.selected = [];
    } else {
      console.log(event.detail, 'selected');
      this.selectedDataItems = event.detail as any as LSApiElement[];
    }

    // change style of selected fields
    event.detail.forEach(fc => {
      const fu = this.component.shadowRoot.getElementById('ls-field-' + fc.id) as HTMLLsEditorFieldElement;
      fu.selected = true;
    });

    // this.selected = fields.filter(fx => fx.selected) as HTMLLsEditorFieldElement[];
    this.selected.forEach(s => (s.selected = event.detail.map(d => d.id).includes(s.dataItem.id)));

    this.validationErrors = validate.bind(this)(this._template);
  }

  // Send role selection changes to bars and panels
  @Listen('roleChange')
  roleHandler(event: CustomEvent<number>) {
    this.signer = event.detail;
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
    this.showPageFields(this.pageNum);
    this.pageResize();
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
    this.showPageFields(this.pageNum);
    this.pageResize();
  }

  /**
   * Unselect all fields
   */
  @Method()
  async unselect() {
    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    fields.forEach(fu => {
      fu.selected = false;
    });
    this.selected = [];
  }

  pageResize() {
    this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
    const frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLDivElement;
    // const wrapper = this.component.shadowRoot.getElementById('document-frame-wrapper') as HTMLDivElement;
    this.canvas.style.height = this.pageDimensions[this.pageNum - 1].height * this.zoom + 'px';
    this.canvas.style.width = this.pageDimensions[this.pageNum - 1].width * this.zoom + 'px';

    frame.style.height = this.pageDimensions[this.pageNum - 1].height * this.zoom + 'px';
    frame.style.width = this.pageDimensions[this.pageNum - 1].width * this.zoom + 'px';
  }

  /**
   * Page and field resize on zoom change
   *
   */
  @Method()
  async setZoom(z: number) {
    this.zoom = z;
    this.pageResize();

    // wrapper.style.height = this.pageDimensions[this.pageNum - 1].height * z + 200 + 'px';
    // wrapper.style.width = this.pageDimensions[this.pageNum - 1].width * z + 600 + 'px';

    // place all fields at new zoom level
    this.component.shadowRoot.querySelectorAll('ls-editor-field').forEach(fx => moveField.bind(this)(fx, fx.dataItem));

    this.queueRenderPage(this.pageNum);
    this.showPageFields(this.pageNum);
  }

  /**
   * Ensure broken or misplaced fields are put onto the page.
   * {number} position
   */
  clip(legacyPosition: number, failback: number = 0.0): number {
    return legacyPosition > 1 ? failback : legacyPosition;
  }

  /**
   * Decorate the template data object with useful transformations.
   * {string} json of template
   */
  parseTemplate(newValue: string) {
    const newTemplate: LSApiTemplate = JSON.parse(newValue) as any as LSApiTemplate;
    const pages = JSON.parse(JSON.parse(newTemplate.pageDimensions));

    // Convert ax,bx,ay etc. into top, left
    // We also add the templateId into every object so that all the information
    // required to mutate is in each object.
    this.pageDimensions = pages.map(p => {
      return { height: p[1], width: p[0] };
    });
    const fields = newTemplate.elementConnection.templateElements.map(f => {
      return {
        ...f,
        top: Math.floor(this.clip(f.ay) * this.pageDimensions[0].height),
        left: Math.floor(this.clip(f.ax) * this.pageDimensions[0].width),
        height: Math.floor((this.clip(f.by, 0.1) - this.clip(f.ay)) * this.pageDimensions[0].height),
        width: Math.floor((this.clip(f.bx, 0.2) - this.clip(f.ax)) * this.pageDimensions[0].width),
        templateId: newTemplate.id,
      };
    });

    const preparedRoles: LSApiRole[] = newTemplate.roles.map((ro: LSApiRole) => {
      return { ...ro, templateId: newTemplate.id };
    });

    this.signer = preparedRoles.length > 0 ? 1 : 0;

    this._template = {
      ...newTemplate,
      elementConnection: { ...newTemplate.elementConnection, templateElements: fields },
      roles: preparedRoles,
    };
  }

  /**
   * Render the page based on pageNumber
   * {number} pageNumber
   */
  private readonly RENDER_SCALE = 2;

  renderPage(pageNumber: number): void {
    this.isPageRendering = true;
    if (this.pdfDocument !== undefined && this.pdfDocument !== null) {
      this.pdfDocument.getPage(pageNumber).then((page: PDFPageProxy) => {
        const viewport: PageViewport = page.getViewport({ scale: this.zoom * this.RENDER_SCALE });

        this.canvas.height = Math.floor(viewport.height);
        this.canvas.width = Math.floor(viewport.width);

        this.canvas.style.width = Math.floor(this.pageDimensions[this.pageNum - 1].width * this.zoom) + 'px';
        this.canvas.style.height = Math.floor(this.pageDimensions[this.pageNum - 1].height * this.zoom) + 'px';

        const renderContext = {
          canvasContext: this.ctx,
          viewport,
        };

        // Render page method
        const renderTask: RenderTask = page.render(renderContext as any);

        // Wait for rendering to finish
        renderTask.promise.then(() => {
          this.isPageRendering = false;
          this.pageRendered.emit(this.pageNum);

          if (this.pageNumPending !== null) {
            this.renderPage(this.pageNumPending); // New page rendering is pending
            this.pageChange.emit(this.pageNumPending); // emit
            this.pageNumPending = null;
          }
        });
      });
    }
  }

  private queueRenderPage(pageNumber: number): void {
    if (this.isPageRendering) {
      this.pageNumPending = pageNumber;
    } else {
      this.renderPage(pageNumber);
    }
  }

  private loadAndRender(src: string): void {
    getDocument(src).promise.then((pdfDocument: PDFDocumentProxy) => {
      this.pdfDocument = pdfDocument;
      this.renderPage(this.pageNum);
    });
  }

  // Fills in and converts all utility and placement fields
  prepareElement(newElement: LSApiElement): LSApiElement {
    return {
      ...newElement,
      top: Math.floor(this.clip(newElement.ay) * this.pageDimensions[newElement.page - 1].height),
      left: Math.floor(this.clip(newElement.ax) * this.pageDimensions[newElement.page - 1].width),
      height: Math.floor((this.clip(newElement.by, 0.05) - this.clip(newElement.ay)) * this.pageDimensions[newElement.page - 1].height),
      width: Math.floor((this.clip(newElement.bx, 0.2) - this.clip(newElement.ax)) * this.pageDimensions[newElement.page - 1].width),
      pageDimensions: this.pageDimensions[newElement.page - 1],
      templateId: this._template.id,
    };
  }

  // internal forced change
  syncChange(update: LSMutateEvent) {
    if (update?.select === 'clear') {
      this.unselect();
    }

    if (getApiType(update.data) === 'element') {
      if (update.action === 'create') {
        //      const newData = { ...update.data, page: this.pageNum };
        //        addField.bind(this)(this.component.shadowRoot.getElementById('ls-document-frame'), newData);
        //const newField = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;
        //this.selected = [newField];
        //this.selectFields.emit([newData as LSApiElement]);
      } else if (update.action === 'update') {
        const fi = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;
        if (fi) {
          moveField.bind(this)(fi, update.data);
          // const fu = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;

          // fu.dataItem = update.data as LSApiElement;
          // Refresh the selected array
          this.selectFields.emit(this.selected.map(sf => sf.dataItem));
          this.selected = this.selected.map(s => (s.dataItem.id === update.data.id ? fi : s));
        }
        // Reselect the fields - this updates the dataItem value passed to child controls
        const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
        this.selected = Array.from(fields).filter(fx => fx.selected);
      } else if (update.action === 'delete') {
        const fi = this.component.shadowRoot.getElementById('ls-field-' + update.data.id) as HTMLLsEditorFieldElement;
        if (!fi) return;
        const fields = this._template.elementConnection.templateElements;
        this._template = { ...this._template, elementConnection: { ...this._template.elementConnection, templateElements: fields.filter(f => f.id !== update.data.id) } };
        this.component.shadowRoot.getElementById('ls-document-frame').removeChild(fi);
        this.selectFields.emit([]);
      } else {
        console.warn('Unrecognised action, check Legalesign documentation. `create`, `update` and `delete` allowed.');
      }
    }

    this.validationErrors = validate.bind(this)(this._template);
    this.validate.emit({ valid: this.validationErrors.length === 0 });
  }

  initViewer() {
    // Generate a canvas to draw the background PDF on.
    this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
    this.canvas.style.height = this.pageDimensions[this.pageNum - 1].height * this.zoom + 'px';
    this.canvas.style.width = this.pageDimensions[this.pageNum - 1].width * this.zoom + 'px';
    this.ctx = this.canvas.getContext('2d');
    if (this._template?.link) this.loadAndRender(this._template?.link);

    var dropTarget = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLCanvasElement;

    // Used for single field selection
    if (this.mode !== 'preview' || this._template?.locked === true) {
      dropTarget.addEventListener('click', mouseClick.bind(this));
      document.addEventListener('mousedown', mouseDown.bind(this));
      document.addEventListener('mousemove', mouseMove.bind(this));
      document.addEventListener('mouseup', mouseUp.bind(this));
      dropTarget.addEventListener('dblclick', mouseDoubleClick.bind(this));
      document.addEventListener('keydown', keyDown.bind(this));
      dropTarget.addEventListener('dragenter', event => {
        event.preventDefault();
      });
      dropTarget.addEventListener('dragover', event => {
        event.preventDefault();
      });
      dropTarget.addEventListener('drop', mouseDrop.bind(this));
    }
    this.generateFields();
  }

  // Generate all the field HTML elements that are required (for every page)
  generateFields(clearExisting: boolean = true) {
    if (clearExisting) {
      const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
      fields.forEach(fi => this.component.shadowRoot.getElementById('ls-document-frame').removeChild(fi));
    }

    this._template.elementConnection.templateElements.forEach(te => {
      addField.bind(this)(this.component.shadowRoot.getElementById('ls-document-frame'), this.prepareElement(te));
    });
  }

  showPageFields(page: number) {
    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    Array.from(fields).forEach(fx => {
      fx.className = fx.dataItem.page === page ? '' : 'ls-dv-hidden';
      // Find assignee for this field
      const data = fx.dataItem;
      const assignee = this.mode === 'compose' ? this._recipients?.find(r => r.signerIndex === data.signer) : this._template.roles.find(r => r.signerIndex === data.signer);
      fx.setAttribute(
        'assignee',
        this.mode === 'compose' && assignee?.previousRecipientDecides === true
          ? 'To Be Decided'
          : this.mode === 'compose'
            ? `${assignee?.firstName} ${assignee?.lastName}`
            : assignee?.name || `Participant ${data.signer}`,
      );
    });
  }

  async load() {
    this.isLoading = true;
    // Get all template and group listing data.
    try {
      this.adapter = new LsDocumentAdapter(this.endpoint);
      const result = (await this.adapter.execute(this.token, getTemplate(this.templateid))) as any;
      this.parseTemplate(JSON.stringify(result.template));
      const resultGroup = (await this.adapter.execute(this.token, getGroupData(this._template.groupId))) as any;
      this.groupInfo = resultGroup.group;
      this.initViewer();

      if (this.mode === 'compose') {
        this.manager = 'recipient';
        this._recipients = JSON.parse(this.recipients.replace('\u0022', '"')).sort((a, b) => {
          // Signers (signerIndex < 100) come before witnesses (signerIndex >= 100) for the same base index
          const aBase = a.signerIndex % 100 || 100;
          const bBase = b.signerIndex % 100 || 100;
          if (aBase !== bBase) return aBase - bBase;
          // If base is the same, signer comes before witness
          if (a.signerIndex < 100 && b.signerIndex >= 100) return -1;
          if (a.signerIndex >= 100 && b.signerIndex < 100) return 1;
          // Otherwise, keep original order
          return a.signerIndex - b.signerIndex;
        });

        //Generate roles for any not already present
        generateRoles.bind(this)();
      }

      //Revalidate
      this.validationErrors = validate.bind(this)(this._template);
      this.validate.emit({ valid: this.validationErrors.length === 0 });
      this.pageCount = this._template.pageCount;
      this.selected = [];
      this.setZoom(1.0);
      this.isLoading = false;
    } catch (e) {
      console.error('Your access token is invalid.', e);
      this.error = 'Unable to load template. Please check your access token is valid and try again.';
      this.isLoading = false;
    }
  }

  componentWillLoad() {
    if (this.token && !this._template) this.load();
  }

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
  }

  handleManagerChange(manager: string) {
    this.manager = manager as any;
  }

  showTool(fieldFormType: string): boolean {
    return this.filtertoolbox === null || this.filtertoolbox.split('|').includes(fieldFormType);
  }

  /// Check if the current signer has a role of the specified type
  checkType(type: LSApiRoleType): boolean {
    if (this.mode === 'compose' && this._recipients) {
      return this._recipients.find(r => r.roleType === type && r.signerIndex === this.signer) !== undefined;
    } else if (this._template) {
      return this._template.roles.find(r => r.roleType === type && r.signerIndex === this.signer) !== undefined;
    } else return false;
  }

  render() {
    return (
      <Host>
        <>
          {this.isLoading && (
            <>
              <ls-page-loader />
              <div class={'ls-dv-custom-loader-slot'}>
                <slot name="custom-loader"></slot>
              </div>
              {this.mode === 'compose' && <ls-compose-loader />}
            </>
          )}
          {this.error && (
            <div class="ls-dv-error-state">
              <div class="ls-dv-error-card">
                <ls-icon name="exclamation-circle" size="2rem" style={{ color: 'var(--red-60, #dc2626)' }} />
                <p class="ls-dv-error-title">Authentication Error</p>
                <p class="ls-dv-error-message">{this.error}</p>
              </div>
            </div>
          )}
          <div class="ls-dv-page-header">
            <div class={'ls-dv-left-slot-wrapper'}>
              <slot name="left-button" />
            </div>
            <div class={'ls-dv-right-slot-wrapper'}>
              <slot name="right-button" />
            </div>
            {this.mode === 'editor' && (
              <div>
                <span class="ls-dv-header-text-1">Template Creation</span>
                <span>/</span>
                <span class="ls-dv-header-text-2">{this._template?.title}</span>
                <div class={'ls-dv-validation-tag-wrapper'}>
                  <ls-validation-tag validationErrors={this.validationErrors} />
                </div>
              </div>
            )}
            {this.mode === 'compose' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <slot name="top-bar"></slot>
              </div>
            )}
          </div>

          <form id="ls-editor-form">
            <ls-left-bar
              mode={this.mode}
              selected={this.selected}
              manager={this.manager}
              signer={this.signer}
              filtertoolbox={this.filtertoolbox}
              template={this._template}
              recipients={this._recipients}
              validationErrors={this.validationErrors}
              fieldTypeSelected={this.fieldTypeSelected}
              displayTable={this.displayTable}
              selectedDataItems={this.selectedDataItems}
              onManagerChange={e => this.handleManagerChange(e.detail)}
              onClearSelected={() => {
                this.selected = [];
              }}
            >
              <slot name="recipient-panel" slot="recipient-panel" />
            </ls-left-bar>
            <ls-toolbar id="ls-toolbar" template={this._template} editor={this} groupInfo={this.groupInfo} mode={this.mode} />
            <div id="ls-mid-area">
              <div class={'ls-dv-document-frame-wrapper'} id="document-frame-wrapper">
                <div id="ls-document-frame">
                  <canvas id="pdf-canvas" class={this.displayTable || this.isLoading ? 'ls-dv-hidden' : ''}></canvas>
                  <ls-editor-table editor={this} class={this.displayTable ? '' : 'ls-dv-hidden'} />
                  <div id="ls-box-selector"></div>
                </div>
              </div>
              <ls-statusbar editor={this} page={this.pageNum} pageCount={this.pageCount} />
            </div>
          </form>
        </>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
