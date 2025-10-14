import { Component, Host, h, Element, State, Prop, Watch, Listen } from '@stencil/core';
import { LSApiElement } from '../../components';
import { getInputType } from '../ls-document-viewer/editorUtils';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

@Component({
  tag: 'ls-editor-field',
  styleUrl: 'ls-editor-field.css',
  shadow: true,
})
export class LsEditorField {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement;
  @Prop() selected: boolean;
  @Prop() readonly: boolean;
  @Prop() type: 'text' | 'signature' | 'date' | 'regex' | 'file' | 'number' | 'autodate';
  @Prop() page: { height: number; width: number };
  @State() isEditing: boolean = false;
  @State() heldEdge: string = null;
  @State() isEdgeDragging: boolean = false;
  @State() innerValue: string;
  private sizeObserver: ResizeObserver;

  @Listen('keydown')
  handleInput(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.isEditing = false;
      this.sizeObserver.observe(this.component.shadowRoot.getElementById('field-info'));
    }
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
  handleDoubleClick() {
    if (this.readonly) return;
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
  }

  @Listen('dragstart', { capture: false, passive: false })
  handleDragStart(event) {
    console.log('dragstart ls-editor-field', event, this.type);
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
      this.component.style.background = defaultRolePalette[this.dataItem?.signer % 100].s20;
      this.component.style.opacity = '0.7';
      this.component.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
      this.component.style.background = '#ffffff';
      this.component.style.opacity = '0.7';
      this.component.style.boxShadow = 'none';
    }
  }

  onInputChange(e) {
    // console.log("INPUT CHANGE", e);
    console.log(this.dataItem);
    this.innerValue = e.target.value;
  }

  componentDidLoad() {
    this.sizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect) {
          //          const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLElement;
          const movebox = this.component.shadowRoot.getElementById('field-info') as HTMLElement;
          // console.log(editbox)
          // editbox.style.height = entry.contentRect.height + "px"
          // editbox.style.width = entry.contentRect.width + "px"

          movebox.style.height = entry.contentRect.height + 'px';
          movebox.style.width = entry.contentRect.width + 'px';
        }
      }
    });

    this.sizeObserver.observe(this.component);

    // New dropped components automatically need selecting.
    if (this.selected) {
      this.component.style.background = defaultRolePalette[this.dataItem?.signer % 100].s20;
      this.component.style.opacity = '0.7';
      this.component.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
      this.component.style.background = '#ffffff';
      this.component.style.opacity = '0.7';
      this.component.style.boxShadow = 'none';
    }
  }

  render() {
    return (
      <Host style={{ border: `2px ${defaultRolePalette[this.dataItem?.signer % 100].s60} solid` }}>
        <div
          class={{
            'ls-editor-field': true,
            'is-selected': this.selected,
          }}
        >
          {!this.dataItem?.optional && <ls-icon name="required" size="12" class="required-icon" />}
          { (this.dataItem.formElementType === 'checkbox') ? 
            <input
            id="editing-input"
            class={this.isEditing ? 'ls-editor-field-editable' : 'hidden-field'}
            type='checkbox'
            value={this.dataItem?.value || this.innerValue}
            onChange={e => this.onInputChange(e)}
          />
          :
          <input
            id="editing-input"
            class={this.isEditing ? 'ls-editor-field-editable' : 'hidden-field'}
            type={getInputType(this.dataItem.validation).inputType}
            value={this.dataItem?.value || this.innerValue}
            onChange={e => this.onInputChange(e)}
          />
          }
          
          <div id="field-info" class={this.isEditing ? 'hidden-field' : 'ls-editor-field-draggable'}>
            {this.innerValue || this.dataItem?.label || this.dataItem?.formElementType}
          </div>
        </div>
      </Host>
    );
  }
}
