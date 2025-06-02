import { Component, Host, h } from '@stencil/core';
import { LsIcon } from 'legalesign-ui/dist/components/ls-icon.js';

@Component({
  tag: 'ls-zoom-box',
  styleUrl: 'ls-zoom-box.css',
  shadow: true,
})
export class LsZoomBox {
  render() {
    return (
      <Host>
      <button>
        <LsIcon name='zoom-in-icon'></LsIcon>
      </button>
      <button>
        <LsIcon name='zoom-out-icon'></LsIcon>
      </button>
      </Host>
    );
  }
}
