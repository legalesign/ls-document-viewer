import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-sender',
  styleUrl: 'ls-sender.css',
  shadow: true,
})
export class LsSender {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
