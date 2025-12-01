import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-recipient-manager',
  styleUrl: 'ls-recipient-manager.css',
  shadow: true,
})
export class LsRecipientManager {
  render() {
    return (
      <Host>
        <div class={'ls-editor-infobox'}>
          <h2 class="toolbox-section-title">Recipients & Fields</h2>
          <p class="toolbox-section-description">Select Recipient to Expand and Drag to place Signature fields where you’d like them to Sign.</p>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
