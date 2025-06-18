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
      </Host>
    );
  }
}
