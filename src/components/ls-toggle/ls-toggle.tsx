import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-toggle',
  styleUrl: 'ls-toggle.css',
  shadow: true,
})
export class LsToggle {
  render() {
    return (
      <Host>
        <label class="switch">
          <input type="checkbox"  />
          <span class="slider round"></span>
        </label>
        <slot></slot>
      </Host>
    );
  }
}
