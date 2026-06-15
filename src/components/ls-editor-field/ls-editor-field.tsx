import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../components';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { validationTypes, getInputType } from '../ls-document-viewer/editorUtils';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { dvI18n } from '../../i18n/i18n';
import { validateFieldValue } from '../../utils/fieldValueValidator';

const fieldTypeKeyMap: { [key: string]: string } = {
  'signature': 'toolbox.signature',
  'auto sign': 'toolbox.autosign',
  'text': 'toolbox.text',
  'signing date': 'toolbox.signingdate',
  'date': 'toolbox.date',
  'initials': 'toolbox.initials',
  'checkbox': 'toolbox.checkbox',
  'email': 'toolbox.email',
  'number': 'toolbox.number',
  'image': 'toolbox.image',
  'dropdown': 'toolbox.dropdown',
  'file': 'toolbox.file',
  'drawn field': 'toolbox.drawn',
  'drawn': 'toolbox.drawn',
  'regular expression': 'toolbox.regex',
  'regex': 'toolbox.regex',
};

@Component({
  tag: 'ls-editor-field',
  styleUrl: 'ls-editor-field.scss',
  shadow: true,
})
export class LsEditorField {
  @Element() component: HTMLElement;
  @Prop() assignee: string;
  @Prop({ mutable: true }) dataItem: LSApiElement;
  @Prop() selected: boolean = false;
  @Prop() multiSelected: boolean = false;
  @Prop() readonly: boolean;
  @Prop() type: 'text' | 'signature' | 'date' | 'regex' | 'file' | 'number' | 'signing date';
  @Prop() page: { height: number; width: number };

  private getFieldTypeKey(): string {
    return fieldTypeKeyMap[this.dataItem?.formElementType] || 'toolbox.text';
  }
  @Prop() fixedAspect: number | null = null;
  @State() isEditing: boolean = false;
  @State() heldEdge: string = null;
  @State() isEdgeDragging: boolean = false;
  @State() innerValue: string;
  @State() valueError: string | null = null;
  @Prop() zoom: string;

  private sizeObserver: ResizeObserver;

  @Event({
    bubbles: true,
    cancelable: false,
    composed: true,
  })
  mutate: EventEmitter<LSMutateEvent[]>;

  @Event({
    bubbles: true,
    cancelable: false,
    composed: true,
  })
  update: EventEmitter<LSMutateEvent[]>;

  /**
   * Controls whether floating elements are visible. Set by mouse enter/leave events.
   */
  @Prop({ mutable: true, reflect: true }) floatingActive: boolean = false;

  // Set floatingActive true on mouse enter, false on mouse leave
  private handleMouseEnter = () => {
    this.floatingActive = true;
  };

  private handleMouseLeave = () => {
    this.floatingActive = false;
  };

  @Listen('keydown')
  handleInput(e: KeyboardEvent) {
    if (e.code === 'Enter' && !e.ctrlKey && !e.metaKey) {
      this.isEditing = false;
      this.sizeObserver.observe(this.component.shadowRoot.getElementById('field-info'));
      e.preventDefault();
    }

    e.stopPropagation();
  }

  @Listen('mousemove', { capture: true })
  handleMouseMove(e) {
    if (this.readonly) return;
    if (!e.clientX) return;

    // While dragging (button held), keep current cursor
    if (e.buttons === 1) return;

    // Scale edge threshold so short/narrow fields still have a usable move zone
    const edgeX = Math.min(8, this.component.clientWidth * 0.25);
    const edgeY = Math.min(8, this.component.clientHeight * 0.25);

    const nearLeft = e.offsetX < edgeX;
    const nearRight = (this.component.clientWidth - e.offsetX) < edgeX;
    const nearTop = e.offsetY < edgeY;
    const nearBottom = (this.component.clientHeight - e.offsetY) < edgeY;

    // Corners first
    if ((nearRight && nearBottom) || (nearLeft && nearTop)) {
      this.component.style.cursor = 'nwse-resize';
    } else if ((nearLeft && nearBottom) || (nearRight && nearTop)) {
      this.component.style.cursor = 'nesw-resize';
    } else if (nearLeft || nearRight) {
      this.component.style.cursor = 'ew-resize';
    } else if (nearTop || nearBottom) {
      this.component.style.cursor = 'ns-resize';
    } else {
      this.component.style.cursor = 'move';
    }
  }

  @Listen('dblclick', { capture: true })
  handleDoubleClick(e: MouseEvent) {
    if (this.readonly || this.dataItem.formElementType === 'signature' || this.dataItem.formElementType === 'initials' || this.dataItem.formElementType === 'signing date') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Date fields use selection to open picker, skip dblclick
    if (this.isDateField()) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.isEditing = true;
    this.heldEdge = null;
    this.isEdgeDragging = false;
    this.sizeObserver.disconnect();
    this.innerValue = this.innerValue ? this.innerValue : this.dataItem?.value;

    const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLInputElement;
    console.log(this.dataItem);

    if (editbox) {
      editbox.className = 'ls-dv-editor-field-editable';
      editbox.focus();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  @Listen('mousedown', { capture: true })
  handleMouseDown(e) {
    if (this.readonly) return;
    const edgeX = Math.min(8, this.component.clientWidth * 0.25);
    const edgeY = Math.min(8, this.component.clientHeight * 0.25);

    const nearLeft = e.offsetX < edgeX;
    const nearRight = (this.component.clientWidth - e.offsetX) < edgeX;
    const nearTop = e.offsetY < edgeY;
    const nearBottom = (this.component.clientHeight - e.offsetY) < edgeY;

    if (nearLeft || nearRight || nearTop || nearBottom) {
      // Prevent native drag so mousemove keeps firing during resize
      e.preventDefault();
    }
  }

  @Listen('dragstart', { capture: false, passive: false })
  handleDragStart(event) {
    // Add the target element's id to the data transfer object
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: this.type,
      }),
    );
    event.dataTransfer.dropEffect = 'move';
  }

  @Watch('dataItem')
  watchDataItemHandler() {
    this.valueError = validateFieldValue(
      this.dataItem?.formElementType,
      this.dataItem?.validation,
      this.dataItem?.value,
      this.dataItem?.options,
    );
  }

  @Watch('selected')
  watchSelectedHandler(_newValue: boolean, _oldValue: boolean) {
    if (_newValue) {
      this.component.style.background = this.hexToRgba(defaultRolePalette[this.dataItem?.signer % 100].s20, 0.5);
      this.component.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
      this.component.style.background = 'rgba(255,255,255,0.5)';
      this.component.style.boxShadow = 'none';
    }
  }

  deleteField = () => {
    this.mutate.emit([{ action: 'delete', data: this.dataItem }]);
    this.update.emit([{ action: 'delete', data: this.dataItem }]);
  };

  componentDidLoad() {
    this.valueError = validateFieldValue(
      this.dataItem?.formElementType,
      this.dataItem?.validation,
      this.dataItem?.value,
      this.dataItem?.options,
    );

    this.sizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect) {
          const movebox = this.component.shadowRoot.getElementById('field-info') as HTMLElement;

          movebox.style.height = '100%';
        }
      }
    });

    this.sizeObserver.observe(this.component);

    // New dropped components automatically need selecting.
    if (this.selected) {
      this.component.style.background = this.hexToRgba(defaultRolePalette[this.dataItem?.signer % 100].s20, 0.5);
      this.component.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
      this.component.style.background = this.hexToRgba('ffffff', 0.7);
      this.component.style.boxShadow = 'none';
    }
  }

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  // NOTE this alter is debounced to account for typing
  alter(diff: object) {
    this.dataItem = { ...this.dataItem, ...diff };
    this.update.emit([{ action: 'update', data: this.dataItem }]);
    this.debounce(this.dataItem, 900);
  }

  private labeltimer;

  debounce(data, delay) {
    if (this.labeltimer) clearTimeout(this.labeltimer);

    this.labeltimer = setTimeout(() => {
      const diffs: LSMutateEvent[] = [{ action: 'update', data }];
      this.mutate.emit(diffs);
    }, delay);
  }

  hexToRgba(hex: string, alpha: number): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  private isDateField(): boolean {
    return getInputType(this.dataItem?.validation)?.inputType === 'date';
  }

  private getDateFormat(): string | null {
    const vType = validationTypes.find(v => v.id === this.dataItem?.validation);
    if (!vType || vType.inputType !== 'date') return null;
    return vType.description;
  }

  private toISODate(value: string): string {
    if (!value) return '';
    const format = this.getDateFormat();
    if (!format) return value;

    const sep = format.match(/[/.-]/)?.[0] || '/';
    const parts = format.split(/[/.-]/);
    const valueParts = value.split(sep);
    if (valueParts.length < 2) return value;

    let y = '', m = '', d = '';
    parts.forEach((p, i) => {
      const v = valueParts[i] || '';
      if (p.startsWith('y')) y = v;
      else if (p.startsWith('m')) m = v;
      else if (p.startsWith('d')) d = v;
    });

    if (y.length === 2) y = '20' + y;
    if (!d) d = '01';

    return `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  private formatDateFromISO(isoValue: string): string {
    if (!isoValue) return '';
    const [y, m, d] = isoValue.split('-');
    const format = this.getDateFormat();
    if (!format) return isoValue;

    return format
      .replace('yyyy', y)
      .replace('yy', y.slice(-2))
      .replace('mm', m)
      .replace('dd', d)
      .replace('d', String(parseInt(d)));
  }

  render() {
    const borderColor = this.valueError
      ? 'var(--red-50, #FF5C56)'
      : defaultRolePalette[this.dataItem?.signer % 100].s60;

    const hostStyle = this.floatingActive
      ? { border: `2px ${borderColor} ${this.dataItem?.signer > 99 ? 'dashed' : 'solid'}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', '--field-border-color': borderColor }
      : { border: `2px ${borderColor} ${this.dataItem?.signer > 99 ? 'dashed' : 'solid'}`, '--field-border-color': borderColor };

    const zoomValue = parseFloat(this.zoom) || 1;
    // const topOffset = (this.dataItem.height ?? 1) + 4;
    const topOffset = 24;
    

    return (
      <Host id={this.dataItem ? 'ls-field-' + this.dataItem.id : undefined} style={hostStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div
          class={{
            'ls-editor-field': true,
            'is-selected': this.selected,
          }}
        >
          {!this.dataItem?.optional && (
            <ls-icon
              name="required-icon"
              size={Math.round(12 * zoomValue)}
              class="ls-dv-required-icon"
              customStyle={{
                position: 'absolute',
                top: '50%',
                right: `${0.25 * zoomValue}rem`,
                transform: 'translateY(-50%)',
                lineHeight: '1',
                fontSize: `${0.75 * zoomValue}rem`,
              }}
            />
          )}
          {this.isDateField() ? (
            <input
              id="editing-input"
              class="ls-dv-date-field-input"
              type="date"
              style={{ color: `${defaultRolePalette[this.dataItem?.signer % 100].s100}`, textAlign: 'inherit' }}
              value={this.toISODate(this.dataItem?.value)}
              checked={this.dataItem?.value ? true : false}
              onInput={e => {
                const val = (e.target as HTMLInputElement).value;
                this.alter({ value: this.formatDateFromISO(val) });
              }}
              onChange={e => {
                const val = (e.target as HTMLInputElement).value;
                this.alter({ value: this.formatDateFromISO(val) });
              }}
            />
          ) : (
            <textarea
              id="editing-input"
              class={this.isEditing ? 'ls-dv-editor-field-editable' : 'ls-dv-hidden-field'}
              style={{ color: `${defaultRolePalette[this.dataItem?.signer % 100].s100}`, textAlign: 'inherit' }}
              value={this.dataItem?.value}
              rows={1}
              onInput={e => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
                this.valueError = validateFieldValue(
                  this.dataItem?.formElementType,
                  this.dataItem?.validation,
                  el.value,
                  this.dataItem?.options,
                );
                this.alter({ value: el.value });
              }}
              ref={el => {
                if (el && this.isEditing) {
                  requestAnimationFrame(() => {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                  });
                }
              }}
            />
          )}

          <div id="field-info" class={this.isEditing ? 'ls-dv-hidden-field' : 'ls-dv-editor-field-draggable'}  style={{ color: `${defaultRolePalette[this.dataItem?.signer % 100].s100}` }}>
            <span style={{ width: '100%', display: 'block', textAlign: 'inherit' }}>{(this.dataItem.value.length && this.dataItem.value) || dvI18n.t(this.getFieldTypeKey())}</span>
          </div>
          {(this.floatingActive || this.selected) && !this.multiSelected && this.dataItem?.label && (
            <div
              style={{
                position: 'absolute',
                background: `${defaultRolePalette[this.dataItem?.signer % 100].s20}`,
                color: `${defaultRolePalette[this.dataItem?.signer % 100].s80}`,
                borderRadius: `${0.25 * zoomValue}rem`,
                padding: `${0.125 * zoomValue}rem ${0.25 * zoomValue}rem`,
                top: `-${topOffset * zoomValue}px`,
                fontWeight: '500',
                left: `-${2 * zoomValue}px`,
                whiteSpace: 'nowrap',
                width: 'fit-content',
              }}
            >
              {this.dataItem?.label}
            </div>
          )}
          {(this.floatingActive || this.selected) && !this.multiSelected && (
            <p
              style={{
                position: 'absolute',
                color: 'var(--gray-80, #3a3a3a)',
                bottom: `-${1.75 * zoomValue}rem`,
                fontSize: `${0.625 * zoomValue}rem`,
                left: '0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: `${10 * zoomValue}rem`,
                fontFamily: 'sans-serif',
              }}
            >
              {dvI18n.t('fieldproperties.assignedto')} {this.assignee}
            </p>
          )}
          {this.selected && !this.multiSelected && (
            <div class="resize-handles">
              <div class="resize-handle handle-e" />
              <div class="resize-handle handle-s" />
              <div class="resize-handle handle-se" />
            </div>
          )}
          {this.floatingActive && !this.readonly && (
            <button
              class={'ls-dv-x-button'}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: `${0.875 * zoomValue}rem`,
                height: `${0.875 * zoomValue}rem`,
                lineHeight: `${0.75 * zoomValue}rem`,
                fontSize: `${0.75 * zoomValue}rem`,
              }}
              onClick={() => this.deleteField()}
            >
              <ls-icon name="x-icon" size={Math.round(12 * zoomValue)} />
            </button>
          )}
        </div>
      </Host>
    );
  }
}
