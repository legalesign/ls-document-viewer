import { Component, Element, Host, Prop, h } from '@stencil/core';
import { attachAllTooltips } from '../../utils/tooltip';
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
    attachAllTooltips(this.component.shadowRoot);
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
            <ls-icon name="keyboard" />
          </button>
          {/* <button style={!this.expanded ? { display: 'none' } : { display: 'block' }} data-pendo="launch-new-edit-tour">
            <ls-icon name="map" data-tooltip="Take a Guided Tour" data-tooltip-placement="left" />
          </button> */}
          <button style={!this.expanded ? { display: 'none' } : { display: 'block' }} onClick={() => window.open('https://legalesign.com/articles/', '_blank')}>
            <ls-icon name="book-open" data-tooltip={dvI18n.t('helperbar.viewdocumentation')} data-tooltip-placement="left" />
          </button>
          <button style={!this.expanded ? { display: 'none' } : { display: 'block' }} onClick={() => window.open('https://support.legalesign.io/tickets', '_blank')}>
            <ls-icon name="support" data-tooltip={dvI18n.t('helperbar.contactsupport')} data-tooltip-placement="left" />
          </button>
          <div class="ls-dv-divider" style={!this.expanded ? { display: 'none' } : { display: 'block' }} />
          <button>
            <ls-icon name="question-mark-circle" />
          </button>
        </div>
        <slot></slot>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
