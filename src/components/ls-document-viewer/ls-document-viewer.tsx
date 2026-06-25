// Polyfill URL.parse for older browsers (used by pdfjs-dist)
if (typeof URL.parse !== 'function') {
  (URL as any).parse = function (url: string, base?: string | URL): URL | null {
    try {
      return base ? new URL(url, base) : new URL(url);
    } catch {
      return null;
    }
  };
}

import { Component, Host, Prop, h, Element, Method, State, Listen, Watch } from '@stencil/core';
import { Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';
import { PDFDocumentProxy, PDFPageProxy, PageViewport, RenderTask, GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import { dvI18n } from '../../i18n/i18n';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { addField, moveField } from './editorCalculator';
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_NAME, FIELD_DEFAULTS } from '../../constants/fieldDefaults';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { keyDown } from './keyHandlers';
import { recordMutations } from './history';
import { mouseClick, mouseDoubleClick, mouseDown, mouseMove, mouseUp, toolboxDragStart } from './mouseHandlers';
import { getApiType, getInputType, matchData } from './editorUtils';
import { updateSelectionBox } from './mouseHandlers';
// import { RoleColor } from '../../types/RoleColor';
import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { LsDocumentAdapter } from './adapter/LsDocumentAdapter';
import { getTemplate } from './adapter/templateActions';
import { getGroupData } from './adapter/groupActions';
import { ValidationError } from '../../types/ValidationError';
import { validate } from './validator';
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
  styleUrl: 'ls-document-viewer.scss',
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
  // @ts-ignore
  private _isToolboxDragging: boolean = false;
  // @ts-ignore
  private _cancelToolboxDrag: (() => void) | null = null;

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

  /**
   * Override the detected language. Pass a BCP 47 language code (e.g. 'fr', 'de').
   * {string}
   */
  @Prop() language: string;

  @Watch('language')
  languageChanged(newLang: string) {
    if (newLang) {
      dvI18n.changeLanguage(newLang);
    }
  }

  @Prop({ mutable: true }) zoom: number = 1.0; // hardcoded to scale the document to full canvas size
  @Prop({ mutable: true }) pageNum: number = 1;
  @Prop({ mutable: true }) pageCount: number = 1;
  @Prop({ mutable: true }) signer: number = 0;
  @Prop({ mutable: true }) groupInfo: any;

  @State() _template: LSApiTemplate;
  @State() validationErrors: ValidationError[] = [];
  @State() status: 'Valid' | 'Invalid' | 'Logged Out';
  @State() error: string | null = null;
  @State() errorTitle: string | null = null;

  /**
   * The following state properties define the defaults for field
   * creation. They should be overridden by the users most used
   * values from localStorage or profile settings.
   */
  @State() fontSize: number = DEFAULT_FONT_SIZE;
  @State() fontFamily: string = DEFAULT_FONT_NAME;
  @State() selected: HTMLLsEditorFieldElement[] = [];
  @State() isLoading: boolean = true;
  @State() isMutating: boolean = false;
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
    
    // Update readonly attribute on all existing fields
    const fields = this.component.shadowRoot?.querySelectorAll('ls-editor-field');
    if (fields) {
      fields.forEach(field => {
        field.setAttribute('readonly', String(_newMode === 'preview'));
      });
    }
  }

  @Watch('_template')
  templateLockedHandler() {
    const fields = this.component.shadowRoot?.querySelectorAll('ls-editor-field');
    if (fields) {
      fields.forEach(field => {
        field.setAttribute('readonly', String(this.mode === 'preview' || this._template?.locked));
      });
    }
  }

  @Watch('zoom')
  zoomChanged(newZoom: number) {
    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    fields.forEach(f => f.setAttribute('zoom', String(newZoom)));
    const statusbar = this.component.shadowRoot.querySelector('ls-statusbar') as any;
    if (statusbar) statusbar.zoom = newZoom;
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
  @Event() validate: EventEmitter<{ valid: boolean; errors: ValidationError[] }>;

  @Event({
    bubbles: true,
    composed: true,
  })
  addParticipant: EventEmitter<{ name?: string | null; type: LSApiRoleType; parent?: string | null; signerIndex?: number }>;

  private adapter: LsDocumentAdapter;
  public _skipHistory: boolean = false;

  // Action an external data action and use the result (if required)
  @Listen('mutate')
  mutateHandler(event: CustomEvent<LSMutateEvent[]>) {
    if (this.token && this.adapter) {
      const mutations = Array.isArray(event.detail) ? event.detail : [event.detail];

      // Record history for undo/redo (skip if this mutation came from undo/redo itself)
      if (!this._skipHistory) {
        const beforeStates = new Map<string, any>();
        mutations.forEach(me => {
          const data = me.data as any;
          if (me.action === 'update' && data?.id) {
            const existing = this.component.shadowRoot?.getElementById('ls-field-' + data.id) as HTMLLsEditorFieldElement;
            if (existing?.dataItem) {
              beforeStates.set(data.id, { ...existing.dataItem });
            }
          } else if (me.action === 'delete' && data?.id) {
            const existing = this.component.shadowRoot?.getElementById('ls-field-' + data.id) as HTMLLsEditorFieldElement;
            if (existing?.dataItem) {
              beforeStates.set(data.id, { ...existing.dataItem });
            }
          }
        });
        recordMutations(mutations, beforeStates);
      }
      this._skipHistory = false;

      this.isMutating = true;
      const promises = mutations.map(me =>
        this.adapter
          .handleEvent(me, this.token)
          .then(result => {
            if (result === 'invalid') return;
            // Cascade name change to witness if it still matches a default pattern
            // Must check before matchData/syncRoles overwrites this._template.roles
            if (me.action === 'update' && (me.data as LSApiRole).roleType !== 'WITNESS') {
              const role = me.data as LSApiRole;
              const oldRole = this._template.roles.find(r => r.id === role.id);
              if (oldRole && oldRole.name !== role.name) {
                const witness = this._template.roles.find(r => r.signerParent === role.id && r.roleType === 'WITNESS');
                if (witness) {
                  const hasDefaultName = witness.name === 'Participant ' + witness.ordinal;
                  const hasParentWitnessName = witness.name === oldRole.name + ' Witness';
                  if (hasDefaultName || hasParentWitnessName) {
                    const updatedWitness = { ...witness, name: role.name + ' Witness' };
                    this.adapter.handleEvent({ action: 'update', data: updatedWitness }, this.token).then(wr => {
                      if (wr !== 'invalid') matchData.bind(this)(wr);
                    });
                  }
                }
              }
            }
            // Swap/delete: after structural changes, sync default names to new ordinals
            if (me.action === 'swap' || me.action === 'delete') {
              // For swap, capture which roles had default names before the sync
              const preSwapDefaults = me.action === 'swap' ? [
                { id: (me.data as LSApiRole).id, hadDefault: (me.data as LSApiRole).name === 'Participant ' + (me.data as LSApiRole).ordinal },
                { id: (me.data2 as LSApiRole).id, hadDefault: (me.data2 as LSApiRole).name === 'Participant ' + (me.data2 as LSApiRole).ordinal },
              ] : null;
              // For delete, snapshot all roles with default names before ordinals shift
              const preDeleteDefaults = me.action === 'delete'
                ? this._template.roles.filter(r => r.name === 'Participant ' + r.ordinal).map(r => r.id)
                : null;
              return Promise.resolve(matchData.bind(this)(result)).then(() => {
                const updates: Promise<any>[] = [];
                if (preSwapDefaults) {
                  for (const { id, hadDefault } of preSwapDefaults) {
                    if (!hadDefault) continue;
                    const fresh = this._template.roles.find(r => r.id === id);
                    if (fresh && fresh.name !== 'Participant ' + fresh.ordinal) {
                      updates.push(this.adapter.handleEvent({ action: 'update', data: { ...fresh, name: 'Participant ' + fresh.ordinal } }, this.token).then(r => {
                        if (r !== 'invalid') matchData.bind(this)(r);
                      }));
                    }
                  }
                }
                if (preDeleteDefaults) {
                  for (const id of preDeleteDefaults) {
                    const fresh = this._template.roles.find(r => r.id === id);
                    if (fresh && fresh.name !== 'Participant ' + fresh.ordinal) {
                      updates.push(this.adapter.handleEvent({ action: 'update', data: { ...fresh, name: 'Participant ' + fresh.ordinal } }, this.token).then(r => {
                        if (r !== 'invalid') matchData.bind(this)(r);
                      }));
                    }
                  }
                }
                return Promise.all(updates);
              });
            }
            matchData.bind(this)(result);
          })
          .then(() => this.syncChange(me))
          .catch(() => {
            // Revalidate against current template state on API failure
            this.validationErrors = validate.bind(this)(this._template);
            this.validate.emit({ valid: this.validationErrors.length === 0, errors: this.validationErrors });
          }),
      );
      Promise.all(promises).finally(() => {
        requestAnimationFrame(() => {
          this.isMutating = false;
        });
      });
    }
  }

  @Listen('update')
  updateHandler(event: CustomEvent<LSMutateEvent[]>) {
    const details = event.detail;
    if (!details || !Array.isArray(details) || details.length === 0) return;
    event.stopPropagation();

    const source = event.target as HTMLElement;
    const isFromEditorField = source?.tagName === 'LS-EDITOR-FIELD';

    for (const detail of details) {
      if (detail?.action === 'update' && detail?.data?.id) {
        const updatedData = detail.data as LSApiElement;

        // Sync selectedDataItems so sidebar reflects the latest value
        this.selectedDataItems = this.selectedDataItems.map(item =>
          item.id === updatedData.id ? { ...updatedData } : item,
        );

        // Sync toolbar dataItem so format/alignment changes use current values
        const toolbar = this.component.shadowRoot.getElementById('ls-toolbar') as HTMLLsToolbarElement;
        if (toolbar?.dataItem) {
          toolbar.dataItem = toolbar.dataItem.map(item =>
            item.id === updatedData.id ? { ...updatedData } : item,
          );
        }

        // Only sync editor field if the change came from the sidebar
        if (!isFromEditorField) {
          const editorField = this.component.shadowRoot?.getElementById('ls-field-' + updatedData.id) as HTMLLsEditorFieldElement;
          if (editorField) {
            editorField.dataItem = { ...updatedData };
          }
        }
      }
    }

    // Optimistic validation: run validate against a temp template with the updated element
    const optimisticTemplate = {
      ...this._template,
      elementConnection: {
        ...this._template.elementConnection,
        templateElements: this._template.elementConnection.templateElements.map(el => {
          const updated = details.find(d => d.action === 'update' && d.data?.id === el.id);
          return updated ? { ...el, ...updated.data } as LSApiElement : el;
        }),
      },
    };
    this.validationErrors = validate.bind(this)(optimisticTemplate as LSApiTemplate);
    this.validate.emit({ valid: this.validationErrors.length === 0, errors: this.validationErrors });
  }

  @Listen('fieldTypeSelected')
  handleFieldTypeSelected(event) {
    const fields = this.component.shadowRoot.querySelectorAll('ls-toolbox-field');

    fields.forEach(element => {
      element.isSelected = element.formElementType === event.detail.formElementType;
    });

    this.fieldTypeSelected = event.detail;
  }

  @Listen('toolboxDragStart')
  handleToolboxDragStart(event) {
    toolboxDragStart.bind(this)(event.detail);
  }

  // generate a new role on the template
  @Listen('addParticipant')
  addParticpantHandler(event: CustomEvent<{ name: string | null; type: LSApiRoleType; parent?: string | null; signerIndex?: number }>) {
    const defaultExperience = this.groupInfo.experienceConnection.experiences.find(x => x.defaultExperience === true);
    const parent = event.detail.signerIndex > 99 ? this._template.roles.find(r => r.signerIndex === event.detail.signerIndex % 100) : null;
    const newSignerIndex =
      event.detail.type === 'WITNESS' ? parent.signerIndex + 100 : Math.max(...this._template.roles.filter(r => r.roleType !== 'WITNESS').map(r => r.signerIndex)) + 1;

    const resolvedSignerIndex = event.detail.signerIndex
      ? event.detail.signerIndex
      : event.detail.type === 'WITNESS'
        ? 100 + parent?.signerIndex
        : this._template.roles.length === 0
          ? 1
          : newSignerIndex;

    const data: LSMutateEvent[] = [
      {
        action: 'create',
        data: {
          id: btoa('rol' + crypto.randomUUID()),
          name: event.detail.name
            ? event.detail.name
            : event.detail.type === 'WITNESS'
              ? (parent?.name === 'Participant ' + parent?.ordinal ? 'Participant ' + (parent?.ordinal + 1) : parent?.name + ' Witness')
              : 'Participant ' + (this._template.roles.length + 1),
          roleType: event.detail.type,
          signerIndex: resolvedSignerIndex,
          ordinal: event.detail.type === 'WITNESS' ? parent?.ordinal + 1 : this._template.roles.length + 1,
          signerParent: event.detail.parent,
          experience: defaultExperience.id,
          templateId: this._template.id,
        },
      },
    ];
    this.mutate.emit(data);

    // Auto-select the newly created participant
    this.signer = resolvedSignerIndex;
  }

  // change the signer selected
  @Listen('changeSigner')
  updateSigner(event: CustomEvent<number>) {
    if (event.detail) {
      this.signer = event.detail;
    }
  }

  // Handle field selection from validation tag for immediate placement
  @Listen('selectFieldForPlacement')
  selectFieldForPlacement(event: CustomEvent<{ signerIndex: number; fieldType: string }>) {
    const { signerIndex, fieldType } = event.detail;

    // Update the active signer
    this.signer = signerIndex;

    // Build the field data directly from defaults
    const defaults = FIELD_DEFAULTS[fieldType] || FIELD_DEFAULTS['signature'];
    
    // Map formElementType to elementType correctly
    let elementType: 'text' | 'signature' | 'initials' | 'admin';
    if (fieldType === 'signature') {
      elementType = 'signature';
    } else if (fieldType === 'initials') {
      elementType = 'initials';
    } else if (fieldType === 'auto sign') {
      elementType = 'admin';
    } else {
      elementType = 'text';
    }
    
    this.fieldTypeSelected = {
      label: fieldType,
      formElementType: fieldType,
      elementType: elementType,
      validation: 0,
      defaultHeight: defaults.defaultHeight,
      defaultWidth: defaults.defaultWidth,
    };

    // Switch to toolbox view if not already there
    if (this.manager !== 'toolbox') {
      this.manager = 'toolbox';
    }

    // Initiate dragging for the selected field type on next tick
    // (current mousedown/mouseup cycle needs to complete first)
    requestAnimationFrame(() => {
      toolboxDragStart.bind(this)(this.fieldTypeSelected);
    });
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
    const isMulti = event.detail.length > 1;
    fields.forEach(f => {
      (f as HTMLLsEditorFieldElement).selected = false;
      (f as HTMLLsEditorFieldElement).multiSelected = false;
    });
    event.detail.forEach(fc => {
      const fu = this.component.shadowRoot.getElementById('ls-field-' + fc.id) as HTMLLsEditorFieldElement;
      if (fu) {
        fu.selected = true;
        fu.multiSelected = isMulti;
      }
    });

    this.selected = (fields as HTMLLsEditorFieldElement[]).filter(fx => fx.selected);

    // Open date picker only when exactly one date field is selected
    if (event.detail.length === 1) {
      const field = this.component.shadowRoot.getElementById('ls-field-' + event.detail[0].id) as HTMLLsEditorFieldElement;
      if (field && getInputType(event.detail[0].validation)?.inputType === 'date' && this.mode !== 'preview') {
        requestAnimationFrame(() => {
          const editbox = field.shadowRoot?.getElementById('editing-input') as HTMLInputElement;
          if (editbox) editbox.showPicker();
        });
      }
    }

    updateSelectionBox.bind(this)();
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
    updateSelectionBox.bind(this)();
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
    updateSelectionBox.bind(this)();
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
    updateSelectionBox.bind(this)();
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
    updateSelectionBox.bind(this)();
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

    // Only set signer on initial load or if current signer no longer exists
    const signerExistsInRoles = preparedRoles.some(r => r.signerIndex === this.signer);
    if (!signerExistsInRoles) {
      this.signer = preparedRoles.length > 0 ? 1 : 0;
    }

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
          // Update assignee label when signer changes
          const signer = (update.data as any).signer;
          const assignee = this.mode === 'compose'
            ? this._recipients?.find(r => r.signerIndex === signer)
            : this._template.roles.find(r => r.signerIndex === signer);
          fi.setAttribute(
            'assignee',
            signer === 0
              ? 'Sender'
              : this.mode === 'compose' && assignee?.previousRecipientDecides === true
                ? 'To Be Decided'
                : this.mode === 'compose'
                  ? `${assignee?.firstName} ${assignee?.lastName}`
                  : assignee?.name || `Participant ${signer}`,
          );
          this.selected = this.selected.map(s => (s.dataItem.id === update.data.id ? fi : s));
        }
        // Reselect the fields - this updates the dataItem value passed to child controls
        const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
        this.selected = Array.from(fields).filter(fx => fx.selected);
        // Sync selectedDataItems so the sidebar and toolbar reflect updated positions/sizes
        this.selectedDataItems = this.selected.map(f => f.dataItem);
        const toolbar = this.component.shadowRoot.getElementById('ls-toolbar') as HTMLLsToolbarElement;
        if (toolbar) toolbar.dataItem = this.selectedDataItems;
        // Update template elements so validation runs against current data
        this._template = {
          ...this._template,
          elementConnection: { ...this._template.elementConnection, templateElements: Array.from(fields).map(ef => ef.dataItem) },
        };
        // Sync sidebar and toolbar with updated data
        this.selectedDataItems = this.selected.map(s => s.dataItem);
        if (toolbar) toolbar.dataItem = this.selectedDataItems;
        // Update selection box to match new field positions (e.g. after undo/redo)
        updateSelectionBox.bind(this)();
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
    this.validate.emit({ valid: this.validationErrors.length === 0, errors: this.validationErrors });
  }

  initViewer() {
    // Generate a canvas to draw the background PDF on.
    this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
    this.canvas.style.height = this.pageDimensions[this.pageNum - 1].height * this.zoom + 'px';
    this.canvas.style.width = this.pageDimensions[this.pageNum - 1].width * this.zoom + 'px';
    this.ctx = this.canvas.getContext('2d');
    if (this._template?.link) this.loadAndRender(this._template?.link);

    var dropTarget = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLCanvasElement;
    var wrapperTarget = this.component.shadowRoot.getElementById('document-frame-wrapper') as HTMLElement;

    // Used for single field selection
    if (this.mode !== 'preview' || this._template?.locked === true) {
      dropTarget.addEventListener('click', mouseClick.bind(this));
      wrapperTarget.addEventListener('mousedown', mouseDown.bind(this));
      document.addEventListener('mousemove', mouseMove.bind(this));
      document.addEventListener('mouseup', mouseUp.bind(this));
      dropTarget.addEventListener('dblclick', mouseDoubleClick.bind(this));
      document.addEventListener('keydown', keyDown.bind(this));
    }

    // Listen for flushed mutations from destroyed sidebar components
    document.addEventListener('ls-flush-mutate', ((e: CustomEvent) => {
      this.mutate.emit(e.detail);
    }) as EventListener);

    // Pinch-to-zoom (trackpad) and Ctrl/Cmd+scroll zoom
    const wrapper = this.component.shadowRoot.getElementById('document-frame-wrapper');
    wrapper.addEventListener('wheel', (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.95 : 1.05;
      const newZoom = Math.min(Math.max(this.zoom * factor, 0.25), 5);
      const scale = newZoom / this.zoom;

      // Cursor position relative to wrapper viewport
      const rect = wrapper.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      // Adjust scroll so the point under cursor stays fixed
      wrapper.scrollLeft = (wrapper.scrollLeft + cursorX) * scale - cursorX;
      wrapper.scrollTop = (wrapper.scrollTop + cursorY) * scale - cursorY;

      this.setZoom(Math.round(newZoom * 1e2) / 1e2);
    }, { passive: false });

    this.generateFields();
  }

  // Generate all the field HTML elements that are required (for every page)
  generateFields(clearExisting: boolean = true) {
    if (clearExisting) {
      const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
      fields.forEach(fi => this.component.shadowRoot.getElementById('ls-document-frame').removeChild(fi));
    }

    const elements = [...this._template.elementConnection.templateElements];
    this._template = { ...this._template, elementConnection: { ...this._template.elementConnection, templateElements: [] } };
    elements.forEach(te => {
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
        if (!this.recipients) {
          throw new Error('Compose mode requires a "recipients" attribute. See documentation for the expected JSON format.');
        }
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
      this.validate.emit({ valid: this.validationErrors.length === 0, errors: this.validationErrors });
      this.pageCount = this._template.pageCount;
      this.selected = [];
      this.setZoom(1.0);
      this.isLoading = false;

      if (this.mode === 'preview') {
        requestAnimationFrame(() => {
          const midArea = this.component.shadowRoot.getElementById('ls-mid-area');
          const wrapper = this.component.shadowRoot.getElementById('document-frame-wrapper');
          const wrapperStyle = getComputedStyle(wrapper);
          const paddingY = parseFloat(wrapperStyle.paddingTop) + parseFloat(wrapperStyle.paddingBottom);
          const paddingX = parseFloat(wrapperStyle.paddingLeft) + parseFloat(wrapperStyle.paddingRight);
          const availableHeight = midArea.clientHeight - paddingY;
          const availableWidth = midArea.clientWidth - paddingX;
          const scaleH = availableHeight / this.pageDimensions[this.pageNum - 1].height;
          const scaleW = availableWidth / this.pageDimensions[this.pageNum - 1].width;
          const scale = Math.min(scaleH, scaleW);
          this.setZoom(Math.round(scale * 1e2) / 1e2);
        });
      }
    } catch (e: any) {
      this.isLoading = false;
      const isAuthError = e?.message?.includes('401') || e?.message?.includes('403') || e?.message?.includes('Unauthorized') || e?.status === 401 || e?.status === 403;
      if (isAuthError) {
        console.error('Authentication failed.', e);
        this.errorTitle = dvI18n.t('viewer.autherror');
        this.error = dvI18n.t('viewer.autherrormessage');
      } else {
        console.error('Failed to load template.', e?.message || e);
        this.errorTitle = dvI18n.t('viewer.loaderror');
        this.error = dvI18n.t('viewer.loaderrormessage');
      }
    }
  }

  componentWillLoad() {
    if (this.language) {
      dvI18n.changeLanguage(this.language);
    }
    if (this.token && !this._template) this.load();
  }

  componentDidLoad() {}

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
              <div class={'ls-dv-page-loader'}>
                <ls-loading-logo size={200} colour="var(--primary-60)" />
              </div>
              <div class={'ls-dv-custom-loader-slot'}>
                <slot name="custom-loader"></slot>
              </div>
              {this.mode === 'compose' && <ls-compose-loader />}
            </>
          )}
          {this.error && (
            <div class="ls-dv-error-state">
              <div class="ls-dv-error-card">
                <ls-icon name="exclamation-circle-icon" size={32} style={{ color: 'var(--red-60, #dc2626)' }} />
                <p class="ls-dv-error-title">{this.errorTitle}</p>
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
                <span class="ls-dv-header-text-1">{dvI18n.t('viewer.templatecreation')}</span>
                <span>/</span>
                <span class="ls-dv-header-text-2">{this._template?.title}</span>
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
              busy={this.isMutating}
              onManagerChange={e => this.handleManagerChange(e.detail)}
              onClearSelected={() => {
                this.unselect();
                const toolbar = this.component.shadowRoot.getElementById('ls-toolbar') as HTMLLsToolbarElement;
                if (toolbar) toolbar.dataItem = [];
              }}
            >
              <slot name="recipient-panel" slot="recipient-panel" />
            </ls-left-bar>
            <ls-toolbar id="ls-toolbar" template={this._template} editor={this} groupInfo={this.groupInfo} mode={this.mode} signer={this.signer} selected={this.selected} pageNum={this.pageNum} />
            <div id="ls-mid-area">
              <div class={{'ls-dv-document-frame-wrapper': true, 'ls-dv-document-frame-wrapper--preview': this.mode === 'preview'}} id="document-frame-wrapper">
                <div id="ls-document-frame">
                  <canvas id="pdf-canvas" class={this.displayTable || this.isLoading ? 'ls-dv-hidden' : ''}></canvas>
                  <ls-editor-table editor={this} class={this.displayTable ? '' : 'ls-dv-hidden'} />
                  <div id="ls-box-selector"></div>
                  <div id="ls-drag-selector"></div>
                  {this.mode !== 'preview' && !this._template?.locked && !this.isLoading && this._template?.elementConnection?.templateElements?.length > 0 && (
                    <ls-select-menu
                      class="ls-dv-select-menu-position"
                      selected={this.selected}
                      pageNum={this.pageNum}
                      editor={this}
                    />
                  )}
                  {this.mode !== 'preview' && !this._template?.locked && !this.isLoading && this._template?.elementConnection?.templateElements?.length > 0 && (
                    <ls-select-menu
                      class="ls-dv-select-menu-floating"
                      selected={this.selected}
                      pageNum={this.pageNum}
                      editor={this}
                      floating={true}
                    />
                  )}
                </div>
              </div>
              <ls-statusbar editor={this} page={this.pageNum} pageCount={this.pageCount} mode={this.mode} />
              {this.mode === 'editor' && (
                <div class={'ls-dv-validation-tag-wrapper'}>
                  <ls-validation-tag validationErrors={this.validationErrors} />
                  <slot name="next-button"></slot>
                </div>
              )}
            </div>
          </form>
        </>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
