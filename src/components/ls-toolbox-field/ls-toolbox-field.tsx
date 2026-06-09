import { Component, Event, Host, Listen, Prop, Element, h, EventEmitter } from '@stencil/core';
import { Icon } from '../../types/Icon';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { IToolboxField } from '../interfaces/IToolboxField';

@Component({
  tag: 'ls-toolbox-field',
  styleUrl: 'ls-toolbox-field.scss',
  shadow: true,
})
export class LsToolboxField {
  @Element() component: HTMLElement;
  /**
   * The field type of this toolbox item, e.g. 'signature'. Note these should always be lowercase.
   */
  @Prop() formElementType: string;
  @Prop() elementType: 'text' | 'signature' | 'initials' | 'admin';
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

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  toolboxDragStart: EventEmitter<IToolboxField>;

  @Listen('mousedown')
  handleMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;
    event.preventDefault();

    // Always select this field type
    this.fieldTypeSelected.emit({
      label: this.label,
      formElementType: this.formElementType,
      elementType: this.elementType,
      validation: this.validation,
      defaultHeight: this.defaultHeight,
      defaultWidth: this.defaultWidth,
      fixedAspect: this.fixedAspect,
    });

    // Also start dragging
    this.toolboxDragStart.emit({
      label: this.label,
      formElementType: this.formElementType,
      elementType: this.elementType,
      validation: this.validation,
      defaultHeight: this.defaultHeight,
      defaultWidth: this.defaultWidth,
      fixedAspect: this.fixedAspect,
    });
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      console.log('down arrow pressed');
    }
  }

  componentDidLoad() {
  }

  render() {
    return (
      <Host>
        <div
          class={'ls-dv-toolbox-field'}
          style={
            this.isSelected && {
              background: defaultRolePalette[this.signer % 100].s10,
              border: `1px solid ${defaultRolePalette[this.signer % 100].s60}`,
              color: defaultRolePalette[this.signer % 100].s80,
              boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06);`,
            }
          }
        >
          <div
            class="ls-dv-toolbox-field-icon"
            style={{ '--signer-color-light': defaultRolePalette[this.signer % 100].s10, '--signer-color': defaultRolePalette[this.signer % 100].s60 }}
            data-tooltip-id="ls-dv-tooltip" data-tooltip-content={this.tooltip}
            data-tooltip-place="right"
          >
            <ls-icon name={this.icon as any} size={20} />
          </div>
          <p
            class="ls-dv-toolbox-field-label"
            style={
              this.isSelected && {
                color: defaultRolePalette[this.signer % 100].s80,
              }
            }
          >
            {this.label}
          </p>
          {this.redDot && (
            <div class={'ls-dv-warning-box'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={`${this.label} Field Required`} data-tooltip-place="left">
              <ls-icon name="exclamation-circle-icon" size={18} solid />
            </div>
          )}
          <ls-icon name="drag-vertical-icon" size={16} customStyle={{ color: this.isSelected ? defaultRolePalette[this.signer % 100].s60 : '#787a80' }} />
        </div>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
