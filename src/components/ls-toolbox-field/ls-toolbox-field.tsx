import { Component, Host, Listen, Prop, h } from '@stencil/core';
import { Icon } from '../../types/Icon';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

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
   * The icon to display for this field type.
   */
  @Prop() icon: Icon;

  /**
   * The starting height of this control type in pixels.
   */
  @Prop() defaultHeight: number;
  /**
   * The starting width of this control type in pixels.
   */
  @Prop() defaultWidth: number;

  /**
   * The signer color of the element
   */
  @Prop() signer: number = 0;

  @Listen('dragstart')
  handleDragStart(event) {
    // Add the target element's id to the data transfer object
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        formElementType: this.formElementType,
        elementType: this.elementType,
        validation: this.validation,
        defaultHeight: this.defaultHeight,
        defaultWidth: this.defaultWidth,
      }),
    );
    event.dataTransfer.dropEffect = 'copy';
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      console.log('down arrow pressed');
    }
  }

  render() {
    return (
      <Host draggable="true">
        <div class="toolbox-field-icon" style={{ '--signer-color-light': defaultRolePalette[this.signer % 100].s10, '--signer-color': defaultRolePalette[this.signer % 100].s60 }}>
          <ls-icon name={this.icon} size="20" />
        </div>
        <p class="toolbox-field-label">{this.label}</p>
        <ls-icon name="drag-vertical" size="16" color="#787a80" />
      </Host>
    );
  }
}
