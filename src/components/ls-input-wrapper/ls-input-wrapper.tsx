import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-input-wrapper',
  styleUrl: 'ls-input-wrapper.css',
  shadow: true,
})
export class LsInputWrapper {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
