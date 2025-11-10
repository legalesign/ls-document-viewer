import { Component, Element, Host, Prop, h } from '@stencil/core';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-helper-bar',
  styleUrl: 'ls-helper-bar.css',
  shadow: true,
})
export class LsHelperBar {
  @Element() component: HTMLElement;
  @Prop() expanded: boolean = false;

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
  }

  render() {
    return (
      <Host>
        <div class={'controls-bar'} onMouseEnter={() => (this.expanded = true)} onMouseLeave={() => (this.expanded = false)}>
          <button
            style={!this.expanded ? { display: 'none' } : { display: 'block' }}
            
            data-pendo="launch-new-edit-tour"
          >
            <ls-icon name="map" data-tooltip="Take a Guided Tour"
            data-tooltip-placement="left" />
          </button>
          <button style={!this.expanded ? { display: 'none' } : { display: 'block' }} >
            <ls-icon name="keyboard" data-tooltip="Keyboard Shortcuts" data-tooltip-placement="left" />
          </button>
          <button style={!this.expanded ? { display: 'none' } : { display: 'block' }} >
            <ls-icon name="book-open" data-tooltip="View Documentation" data-tooltip-placement="left" />
          </button>
          <div class="divider" style={!this.expanded ? { display: 'none' } : { display: 'block' }} />
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
