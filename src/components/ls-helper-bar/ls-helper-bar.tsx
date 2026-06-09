import { Component, Element, Host, Prop, h } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-helper-bar',
  styleUrl: 'ls-helper-bar.scss',
  shadow: true,
})
export class LsHelperBar {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) expanded: boolean = false;
  @Prop({ mutable: true }) showShortcuts: boolean = false;

  componentDidLoad() {
  }

  render() {
    return (
      <Host>
        <div class={'ls-dv-controls-bar'} onMouseEnter={() => (this.expanded = true)} onMouseLeave={() => (this.expanded = false)}>
          <button
            style={!this.expanded ? { display: 'none' } : { display: 'block', position: 'relative' }}
            id="keyboard-btn"
            onMouseEnter={() => (this.showShortcuts = true)}
            onMouseLeave={() => (this.showShortcuts = false)}
          >
            <ls-keyboard-shortcuts style={!this.showShortcuts ? { display: 'none' } : { display: 'block' }} />
            <ls-icon name="keyboard-icon" />
          </button>
          {/* <button style={!this.expanded ? { display: 'none' } : { display: 'block' }} data-pendo="launch-new-edit-tour">
            <ls-icon name="map-icon" data-tooltip-id="ls-dv-tooltip" data-tooltip-content="Take a Guided Tour" data-tooltip-place="left" />
          </button> */}
          <button style={!this.expanded ? { display: 'none' } : { display: 'block' }} onClick={() => window.open('https://docs.legalesign.com/web-app/how-to/fields', '_blank')}>
            <ls-icon name="book-open-icon" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('helperbar.viewdocumentation')} data-tooltip-place="left" />
          </button>
          <button style={!this.expanded ? { display: 'none' } : { display: 'block' }} onClick={() => window.open('https://support.legalesign.io/tickets', '_blank')}>
            <ls-icon name="support-icon" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('helperbar.contactsupport')} data-tooltip-place="left" />
          </button>
          <div class="ls-dv-divider" style={!this.expanded ? { display: 'none' } : { display: 'block' }} />
          <button>
            <ls-icon name="question-mark-circle-icon" />
          </button>
        </div>
        <slot></slot>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
