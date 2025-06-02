import { Component, Host, Listen, Prop, h } from '@stencil/core';
import { LsIcon } from 'legalesign-ui/dist/components/ls-icon.js';

@Component({
  tag: 'ls-toolbox-field',
  styleUrl: 'ls-toolbox-field.css',
  shadow: true,
})
export class LsToolboxField {

  /**
   * Src of the PDF to load and render
   * {number}
   */
  @Prop() value: string;

  @Listen('dragstart')
  handleDragStart(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", this.value);
    ev.dataTransfer.dropEffect = "copy";
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowDown') {
      console.log('down arrow pressed')
    }
  }



  render() {
    return (
      <Host draggable="true">
        <LsIcon name='zoom-in-icon'></LsIcon>
        {this.value}
      </Host>
    );
  }
}
