import { Component, Host, h, Element, State, Prop, Watch, Listen } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-editor-field',
  styleUrl: 'ls-editor-field.css',
  shadow: true,
})
export class LsEditorField {
  @Element() component: HTMLElement;
  @Prop() dataItem: LSApiElement;

  @Prop() type: 'text' | 'signature' | 'date' | 'regex' | 'file' | 'number' | 'autodate';
  @State() isEditing: boolean = false;
  @State() heldEdge: string = null;
  @State() isEdgeDragging: boolean = false;
  @State() innerValue: string;
  private sizeObserver: ResizeObserver;
  private componentObserver: ResizeObserver;
  

  @Listen('keydown', { capture: true })
  handleKeyDown(e) {
    if (e.code == "Enter") {
      this.isEditing = false;
      this.sizeObserver.observe(this.component.shadowRoot.getElementById('field-info'))
    }
  }

  @Listen("mousemove", { capture: true })
  handleMouseMove(e) {
    if(!e.clientX) return;

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
    this.isEditing = true;
    this.heldEdge = null;
    this.isEdgeDragging = false;
    this.sizeObserver.disconnect()
    this.innerValue = this.innerValue ? this.innerValue : this.dataItem?.value;
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

  setAll(top: string, left: string, height: string, width: string) {
    this.setDimensions('editing-input', top, left, height, width)
    this.setDimensions('field-info', top, left, height, width)
    this.setDimensions('ls-editor-field-outer', top, left, height, width)
  }

  setDimensions(id: string, top: string, left: string, height: string, width: string) {
    const targetToSize = this.component.shadowRoot.getElementById(id) as HTMLElement;
    targetToSize.style.top = top
    targetToSize.style.left = left
    targetToSize.style.height = height
    targetToSize.style.width = width
  }

  // Apply @Watch() for the component's `numberContainer` member.
  // Whenever `numberContainer` changes, this method will fire.
  @Watch('isEditing')
  watchStateHandler(_newValue: boolean, _oldValue: boolean) {
    const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLInputElement;
    editbox.focus();
    console.log(_newValue, editbox.value)
    editbox.style.cursor = "auto";
    //editbox.setSelectionRange(editbox.value.length,editbox.value.length,"forward")
    editbox.selectionStart = 0
    editbox.selectionEnd = 0
  }

  onInputChange(e) {
    // console.log("INPUT CHANGE", e);
    this.innerValue = e.target.value;
  }

  componentDidLoad() {
    // this.componentObserver = new ResizeObserver((entries) => {
    //       const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLElement;
    //       const movebox = this.component.shadowRoot.getElementById('draggable-inner') as HTMLElement;

    //   for (const entry of entries) {
    //     console.log(entry)
    //     console.log('resize host')
    //     if (entry.contentRect) {
    //       //editbox.style.top = "1px"
    //       editbox.style.height = entry.contentRect.height - 2 + "px"
    //       editbox.style.width = entry.contentRect.width -  2 + "px"
    //       //movebox.style.top = "1px"
    //       movebox.style.height = entry.contentRect.height - 2 + "px"
    //       movebox.style.width = entry.contentRect.width - 2 + "px"
    //     }}
    // })

    // this.componentObserver.observe(this.component)

    // console.log("ls-editor-field load", this.value)
    this.sizeObserver = new ResizeObserver((entries) => {

      for (const entry of entries) {
        if (entry.contentRect) {
        
          const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLElement;
          const movebox = this.component.shadowRoot.getElementById('field-info') as HTMLElement;
    
          editbox.style.height = entry.contentRect.height + "px"
          editbox.style.width = entry.contentRect.width + "px"

          movebox.style.height = entry.contentRect.height + "px"
          movebox.style.width = entry.contentRect.width + "px"

        }
      }
    })

    this.sizeObserver.observe(this.component)
  }

  render() {
    return (
      <Host>
        <div id="ls-editor-field-outer">
          <input id="editing-input"
            class={this.isEditing ? "ls-editor-field-editable" : "hidden-field"}
            type='text'
            value={this.innerValue || this.dataItem?.value}
            onChange={(e) => this.onInputChange(e)}
          ></input>
          <div id="field-info" class={this.isEditing ? "hidden-field" : "ls-editor-field-draggable"}>
            {this.innerValue || this.type}
          </div>
        </div>
      </Host>
    );
  }
}
