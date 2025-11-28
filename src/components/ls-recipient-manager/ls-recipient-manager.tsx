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
        <div class='recipient-section-title'>Recipients</div>
        <slot></slot>
      </Host>
    );
  }
}
