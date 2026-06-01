import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-recipient-manager',
  styleUrl: 'ls-recipient-manager.scss',
  shadow: true,
})
export class LsRecipientManager {
  render() {
    return (
      <Host>
        <div class={'ls-dv-editor-infobox'}>
          <h2 class="ls-dv-toolbox-section-title">Recipients & Fields</h2>
          <p class="ls-dv-toolbox-section-description">Select Recipient to Expand and Drag to place Signature fields where you’d like them to Sign.</p>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
