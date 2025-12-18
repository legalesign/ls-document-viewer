import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../components';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { getInputType } from '../ls-document-viewer/editorUtils';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

@Component({
  tag: 'ls-editor-field',
  styleUrl: 'ls-editor-field.css',
  shadow: true,
})
export class LsEditorField {
  @Element() component: HTMLElement;
  @Prop() assignee: string;
  @Prop({ mutable: true }) dataItem: LSApiElement;
  @Prop() selected: boolean = false;
  @Prop() readonly: boolean;
  @Prop() type: 'text' | 'signature' | 'date' | 'regex' | 'file' | 'number' | 'autodate';
  @Prop() page: { height: number; width: number };
  @Prop() fixedAspect: number | null = null;
  @State() isEditing: boolean = false;
  @State() heldEdge: string = null;
  @State() isEdgeDragging: boolean = false;
  @State() innerValue: string;
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
    if (e.code === 'Enter') {
      this.isEditing = false;
      this.sizeObserver.observe(this.component.shadowRoot.getElementById('field-info'));
    }

    e.stopPropagation();
  }

  @Listen('mousemove', { capture: true })
  handleMouseMove(e) {
    if (this.readonly) return;
    if (!e.clientX) return;

    // Determine which edge is being moved over and what cursor to show.
    if (Math.abs(e.offsetX) < 5) {
      this.component.style.cursor = 'ew-resize';
    } else if (Math.abs(e.offsetX - this.component.clientWidth) < 5) {
      this.component.style.cursor = 'ew-resize';
    } else if (Math.abs(e.offsetY) < 5) {
      this.component.style.cursor = 'ns-resize';
    } else if (Math.abs(e.offsetY - this.component.clientHeight) < 5) {
      this.component.style.cursor = 'ns-resize';
    } else {
      this.component.style.cursor = 'move';
    }
  }

  @Listen('dblclick', { capture: true })
  handleDoubleClick(e: MouseEvent) {
    if (this.readonly  || this.dataItem.formElementType === 'signature' || this.dataItem.formElementType === 'initials') return;
    this.isEditing = true;
    this.heldEdge = null;
    this.isEdgeDragging = false;
    this.sizeObserver.disconnect();
    this.innerValue = this.innerValue ? this.innerValue : this.dataItem?.value;

    const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLInputElement;
    console.log(this.dataItem);

    if (editbox) {
      editbox.className = 'ls-editor-field-editable';
      editbox.focus();
    }
    e.preventDefault();
    e.stopPropagation();
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
    this.sizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect) {
          const movebox = this.component.shadowRoot.getElementById('field-info') as HTMLElement;

          movebox.style.height = entry.contentRect.height + 'px';
          movebox.style.width = entry.contentRect.width + 'px';
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
    this.debounce(this.dataItem, 900);
  }

  private labeltimer;

  debounce(data, delay) {
    if (this.labeltimer) clearTimeout(this.labeltimer);

    this.labeltimer = setTimeout(() => {
      const diffs: LSMutateEvent[] = [{ action: 'update', data }];
      this.mutate.emit(diffs);
      this.update.emit(diffs);
    }, delay);
  }

  hexToRgba(hex: string, alpha: number): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  render() {
    const hostStyle = this.floatingActive
      ? { border: `2px ${defaultRolePalette[this.dataItem?.signer % 100].s60} solid`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }
      : { border: `2px ${defaultRolePalette[this.dataItem?.signer % 100].s60} solid` };

    const zoomValue = parseFloat(this.zoom) || 1;
    console.log('Zoom value in field:', zoomValue);

    return (
      <Host id={this.dataItem ? 'ls-field-' + this.dataItem.id : undefined} style={hostStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div
          class={{
            'ls-editor-field': true,
            'is-selected': this.selected,
          }}
        >
          {!this.dataItem?.optional && <ls-icon name="required" size={`${0.75 * zoomValue}rem`} class="required-icon" customStyle={{ position: 'absolute', verticalAlign: 'top', top: `${0.125 * zoomValue}rem`, right: `${0.125 * zoomValue}rem` }} />}
          <input
            id="editing-input"
            class={this.isEditing ? 'ls-editor-field-editable' : 'hidden-field'}
            type={getInputType(this.dataItem.validation).inputType}
            value={this.dataItem?.value}
            checked={this.dataItem?.value ? true : false}
            onInput={e => this.alter({ value: (e.target as HTMLInputElement).value })}
          />

          <div id="field-info" class={this.isEditing ? 'hidden-field' : 'ls-editor-field-draggable'} style={{ color: `${defaultRolePalette[this.dataItem?.signer % 100].s100}` }}>
            {(this.dataItem.value.length && this.dataItem.value) || this.dataItem?.formElementType}
          </div>
          {(this.floatingActive || this.selected) && this.dataItem?.label && (
            <div
              style={{
                position: 'absolute',
                background: `${defaultRolePalette[this.dataItem?.signer % 100].s20}`,
                color: `${defaultRolePalette[this.dataItem?.signer % 100].s80}`,
                borderRadius: `${0.25 * zoomValue}rem`,
                padding: `${0.125 * zoomValue}rem ${0.25 * zoomValue}rem`,
                top: `-${1.375 * zoomValue}rem`,
                fontWeight: '500',
                left: `-${2 * zoomValue}px`,
                whiteSpace: 'nowrap',
                width: 'fit-content',
              }}
            >
              {this.dataItem?.label}
            </div>
          )}
          {(this.floatingActive || this.selected) && (
            <p
              style={{
                position: 'absolute',
                color: 'var(--gray-80, #3a3a3a)',
                bottom: `-${1.75 * zoomValue}rem`,
                fontSize: `${0.625 * zoomValue}rem`,
                left: '0',
                whiteSpace: 'nowrap',
                width: 'fit-content',
              }}
            >
              Assigned to: {this.assignee}
            </p>
          )}
          {this.floatingActive && (
            <button
              class={'x-button'}
              style={{
                padding: `${0.125 * zoomValue}rem`,
              }}
              onClick={() => this.deleteField()}
            >
              <ls-icon name="x" size={`${0.625 * zoomValue}rem`} />
            </button>
          )}
        </div>
      </Host>
    );
  }
}
