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
        Recipients
        <slot></slot>
      </Host>
    );
  }
}
