import { Component, Event, Host, Listen, Prop, Element, h, EventEmitter } from '@stencil/core';
import { Icon } from '../../types/Icon';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-toolbox-field',
  styleUrl: 'ls-toolbox-field.css',
  shadow: true,
})
export class LsToolboxField {
  @Element() component: HTMLElement;
  /**
   * The field type of this toolbox item, e.g. 'signature'. Note these should always be lowercase.
   */
  @Prop() formElementType: string;
  @Prop() elementType: string;
  @Prop() validation: number = 0;
  @Prop() fixedAspect: number | null = null;
  @Prop() redDot: boolean = false;

  /**
   * The text to display for this field type.
   */
  @Prop() label: string;

  /**
   * The icon to display for this field type.
   */
  @Prop() icon: Icon;
  /**
   * The tooltip hint to describe to the field type
   */
  @Prop() tooltip: string;

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
  fieldTypeSelected: EventEmitter<{
    label: string;
    elementType: string;
    defaultHeight: number;
    defaultWidth: number;
    formElementType: string;
    validation: number;
    fixedAspect: number | null;
  }>;

  @Listen('dragstart')
  handleDragStart(event) {

    var canvas = document.createElement('div');
    canvas.style.position = 'absolute';
    canvas.style.left = '-100%';
    canvas.style.zIndex = '-100';
    canvas.style.height = this.defaultHeight +'px';
    canvas.style.width = this.defaultWidth +'px';
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    canvas.style.border = `1px dashed ${defaultRolePalette[this.signer % 100].s60}`;
    canvas.innerHTML = this.formElementType;
    document.body.appendChild(canvas); 

    event.dataTransfer.setDragImage(canvas, -50, -20);

    // Add the target element's id to the data transfer object
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        formElementType: this.formElementType,
        elementType: this.elementType,
        validation: this.validation,
        defaultHeight: this.defaultHeight,
        defaultWidth: this.defaultWidth,
        fixedAspect: this.fixedAspect,
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

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
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
          onClick={() => {
            this.fieldTypeSelected.emit({
              label: this.label,
              formElementType: this.formElementType,
              elementType: this.elementType,
              validation: this.validation,
              defaultHeight: this.defaultHeight,
              defaultWidth: this.defaultWidth,
              fixedAspect: this.fixedAspect,
            });
          }}
        >
          <div
            class="toolbox-field-icon"
            style={{ '--signer-color-light': defaultRolePalette[this.signer % 100].s10, '--signer-color': defaultRolePalette[this.signer % 100].s60 }}
            data-tooltip={this.tooltip}
            data-tooltip-placement="right"
          >
            <ls-icon name={this.icon} size="1.25rem" />
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
          {this.redDot && (
            <div class={'warning-box'} data-tooltip={`${this.label} Field Required`} data-tooltip-placement="left">
              <ls-icon name="exclamation-circle" size="1.125rem" solid />
            </div>
          )}
          <ls-icon name="drag-vertical" size="1rem" color="#787a80" />
        </div>
        <ls-tooltip id="ls-tooltip-master" tooltipText="Something" />
      </Host>
    );
  }
}
