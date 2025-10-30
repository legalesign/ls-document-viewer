import { Component, Event, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { Icon } from '../../types/Icon';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { EventEmitter } from 'stream';

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

  @Prop({ mutable: true }) isSelected: boolean = false;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  selected: EventEmitter;

  @Watch('isSelected')
  modeHandler(_isSelected) {
    // When opened fire an event to let the parent handle closing other controls
    if (_isSelected) {
      this.selected.emit(this.formElementType);
    }
  }

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
        <div
          class={'ls-toolbox-field'}
          style={
            this.isSelected && {
              background: defaultRolePalette[this.signer % 100].s10,
              border: `1px solid ${defaultRolePalette[this.signer % 100].s60}`,
              color: defaultRolePalette[this.signer % 100].s80,
              boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06);`,
            }
          }
          onClick={() => (this.isSelected = !this.isSelected)}
        >
          <div
            class="toolbox-field-icon"
            style={{ '--signer-color-light': defaultRolePalette[this.signer % 100].s10, '--signer-color': defaultRolePalette[this.signer % 100].s60 }}
          >
            <ls-icon name={this.icon} size="20" />
          </div>
          <p
            class="toolbox-field-label"
            style={
              this.isSelected && {
                color: defaultRolePalette[this.signer % 100].s80,
              }
            }
          >
            {this.label}
          </p>
          <ls-icon name="drag-vertical" size="16" color="#787a80" />
        </div>
      </Host>
    );
  }
}
