import { Component, Host, Listen, Prop, h } from '@stencil/core';

@Component({
  tag: 'ls-toolbox-field',
  styleUrl: 'ls-toolbox-field.css',
  shadow: true,
})
export class LsToolboxField {

  /**
   * The field type of this toolbox item, e.g. 'signature'. Note these should always be lowercase.
   */
  @Prop() formElementType: string;
  @Prop() elementType: string;
  @Prop() validation: number = 0;
  

  /**
  * The text to display for this field type.
   */
  @Prop() label: string;

  /**
   * The starting height of this control type in pixels.
   */
  @Prop() defaultHeight: number;
  /**
   * The starting width of this control type in pixels.
   */
  @Prop() defaultWidth: number;
  

  @Listen('dragstart')
  handleDragStart(event) {
    // Add the target element's id to the data transfer object
    event.dataTransfer.setData("application/json", JSON.stringify({
      formElementType: this.formElementType,
      elementType: this.elementType,
      validation: this.validation,
      defaultHeight: this.defaultHeight,
      defaultWidth: this.defaultWidth,

    }));
    event.dataTransfer.dropEffect = "copy";

  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      console.log('down arrow pressed')
    }
  }



  render() {
    return (
      <Host draggable="true">
        {this.label}
        <span class="ls-sixdots"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5V5.01M9 12V12.01M9 19V19.01M15 5V5.01M15 12V12.01M15 19V19.01M9 6C8.44772 6 8 5.55228 8 5C8 4.44772 8.44772 4 9 4C9.55229 4 10 4.44772 10 5C10 5.55228 9.55229 6 9 6ZM9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55229 11 10 11.4477 10 12C10 12.5523 9.55229 13 9 13ZM9 20C8.44772 20 8 19.5523 8 19C8 18.4477 8.44772 18 9 18C9.55228 18 10 18.4477 10 19C10 19.5523 9.55228 20 9 20ZM15 6C14.4477 6 14 5.55228 14 5C14 4.44772 14.4477 4 15 4C15.5523 4 16 4.44772 16 5C16 5.55228 15.5523 6 15 6ZM15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13ZM15 20C14.4477 20 14 19.5523 14 19C14 18.4477 14.4477 18 15 18C15.5523 18 16 18.4477 16 19C16 19.5523 15.5523 20 15 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
        
      </Host>
    );
  }
}
