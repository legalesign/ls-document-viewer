import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-zoom-box',
  styleUrl: 'ls-zoom-box.css',
  shadow: true,
})
export class LsZoomBox {
  render() {
    return (
      <Host>
        <slot><button>+</button></slot>
        <slot><button>-</button></slot>
      </Host>
    );
  }
}
