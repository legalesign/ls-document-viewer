import { Component, Host, h, Element, State, Prop, Watch, Listen } from '@stencil/core';

@Component({
  tag: 'ls-editor-field',
  styleUrl: 'ls-editor-field.css',
  shadow: true,
})
export class LsEditorField {
  @Element() component: HTMLElement;
  @Prop() value: string;  

  @Prop() type: 'text' | 'signature' | 'date' | 'regex' | 'file' | 'number' | 'autodate';
  @State() isEditing: boolean = false;
  @State() innerValue: string;

  @Listen('keydown', { capture: true })
  handleKeyDown(e) {
    if (e.code == "Enter") this.isEditing = false;
  }
  
  @Listen('click', { capture: true })
  handleClick() {
        this.isEditing = true;
        this.innerValue = this.innerValue ? this.innerValue : this.value;
    }

  @Listen('dragstart', { capture: true })
  handleDragStart(event) {
        console.log("dragstart ls-editor-field", event, this.type)
    // Add the target element's id to the data transfer object
    event.dataTransfer.setData("application/json", JSON.stringify({
      type: this.type
    }));
    event.dataTransfer.dropEffect = "move";

    }
    // Apply @Watch() for the component's `numberContainer` member.
  // Whenever `numberContainer` changes, this method will fire.
  @Watch('isEditing')
  watchStateHandler(newValue: boolean, oldValue: boolean) {
    console.log('The old value of isEditing is: ', oldValue);
    console.log('The new value of isEditing is: ', newValue);
    const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLElement;
    editbox.focus();    
  }

  onInputChange(e) {
    console.log("INPUT CHANGE", e);
    this.innerValue  = e.target.value;
  }
  // onDragStart(e) {
  //   console.log("dragstart editor-field", e)
  //     // Add the target element's id to the data transfer object
  //     e.dataTransfer.setData("text/plain", "CLONE");
  //     e.dataTransfer.dropEffect = "copy";
  // }

  componentDidLoad() {
    console.log("ls-editor-field load", this.value)

    // const editbox = this.component.shadowRoot.getElementById('editing-input') as HTMLElement;
    // const divbox = this.component.shadowRoot.getElementById('draggable-input') as HTMLElement;
    // const outer = this.component.shadowRoot.getElementById('ls-editor-field-outer') as HTMLElement;

    //outer.addEventListener("dragstart", this.onDragStart)
    // divbox.addEventListener("change", function (evt) { console.log(evt) })
    //divbox.addEventListener("click", this.onClick)
    // editbox.addEventListener("keydown", this.onKeyDown)
  }

  render() {
    return (
      <Host>
        <div id="ls-editor-field-outer" draggable={!this.isEditing}>
          <input id="editing-input"
            class={this.isEditing ? "ls-editor-field-editable" : "hidden-field"}
            type='text'
            value={this.innerValue || this.value}
            onChange={(e) => this.onInputChange(e)}
          ></input>
          <div id="draggable-input" class={this.isEditing ? "hidden-field" : "ls-editor-field-draggable"}>{this.innerValue || this.type}</div>
        </div>
      </Host>
    );
  }
}
