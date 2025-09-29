import { Component, Host, h, Element, State, Prop, Watch, Listen } from '@stencil/core';
import { LSApiElement } from '../../components';
import { getInputType } from '../ls-document-viewer/editorUtils';

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
  @Prop() palette: string[];

  @Prop() type: 'text' | 'signature' | 'date' | 'regex' | 'file' | 'number' | 'autodate';
  @Prop() page: { height: number, width: number };
  @State() isEditing: boolean = false;
  @State() heldEdge: string = null;
  @State() isEdgeDragging: boolean = false;
  @State() innerValue: string;
  private sizeObserver: ResizeObserver;

  @Listen('keydown')
  handleInput(e: KeyboardEvent) {
    if (e.code === "Enter") {
      this.isEditing = false;
      this.sizeObserver.observe(this.component.shadowRoot.getElementById('field-info'))
    }
  }

  @Listen("mousemove", { capture: true })
  handleMouseMove(e) {
    if (this.readonly) return;
    if (!e.clientX) return;

    // Determine which edge is being moved over and what cursor to show.
    if (Math.abs(e.offsetX) < 5) {
      this.component.style.cursor = "ew-resize";
    } else if (Math.abs(e.offsetX - this.component.clientWidth) < 5) {
      this.component.style.cursor = "ew-resize";
    } else if (Math.abs(e.offsetY) < 5) {
      this.component.style.cursor = "ns-resize";
    } else if (Math.abs(e.offsetY - this.component.clientHeight) < 5) {
      this.component.style.cursor = "ns-resize";
    } else {
      this.component.style.cursor = "move";
    }
  };

  @Listen('dblclick', { capture: true })
  handleDoubleClick() {
    if (this.readonly) return;
    this.isEditing = true;
    this.heldEdge = null;
    this.isEdgeDragging = false;
    this.sizeObserver.disconnect()
    this.innerValue = this.innerValue ? this.innerValue : this.dataItem?.value;
    
    const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLInputElement;
    console.log(editbox)

    if(editbox) {
      editbox.className = 'ls-editor-field-editable'
      editbox.focus();
    }
  }

  @Listen('dragstart', { capture: false, passive: false })
  handleDragStart(event) {
    console.log("dragstart ls-editor-field", event, this.type)
    // Add the target element's id to the data transfer object
    event.dataTransfer.setData("application/json", JSON.stringify({
      type: this.type
    }));
    event.dataTransfer.dropEffect = "move";
  }

  @Watch('selected')
  watchSelectedHandler(_newValue: boolean, _oldValue: boolean) {
    if (_newValue) this.component.style.border = "1px dotted red";
    else this.component.style.border = "1px solid black";
  }

  onInputChange(e) {
    // console.log("INPUT CHANGE", e);
    this.innerValue = e.target.value;
  }

  componentDidLoad() {

    this.sizeObserver = new ResizeObserver((entries) => {

      for (const entry of entries) {
        if (entry.contentRect) {

//          const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLElement;
          const movebox = this.component.shadowRoot.getElementById('field-info') as HTMLElement;
          // console.log(editbox)
          // editbox.style.height = entry.contentRect.height + "px"
          // editbox.style.width = entry.contentRect.width + "px"

          movebox.style.height = entry.contentRect.height + "px"
          movebox.style.width = entry.contentRect.width + "px"

        }
      }
    })

    this.sizeObserver.observe(this.component)

    // New dropped components automatically need selecting.
    if (this.selected) this.component.style.border = "1px dotted red";
    else this.component.style.border = "1px solid black";
  }

  



  render() {
    return (
      <Host class={{
        'ls-editor-field': true,
        'is-selected': this.selected
      }}>
          <input id="editing-input"
            class={this.isEditing ? "ls-editor-field-editable" : "hidden-field"}
            type={getInputType(this.dataItem.validation).inputType}
            value={this.dataItem?.value || this.innerValue}
            onChange={(e) => this.onInputChange(e)}
          />
          <div id="field-info" class={this.isEditing ? "hidden-field" : "ls-editor-field-draggable"}>
            {this.innerValue || this.dataItem?.label || this.dataItem?.formElementType}
          </div>
      </Host>
    );
  }
}
