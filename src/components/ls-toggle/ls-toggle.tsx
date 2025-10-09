import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ls-toggle',
  styleUrl: 'ls-toggle.css',
  shadow: true,
})
export class LsToggle {
  @Prop() checked: boolean;
  @Prop() value: string;

  render() {
    return (
      <Host>
        <label class="switch">
          <input type="checkbox" value={this.value} checked={this.checked} />
          <span class="slider round"></span>
        </label>
        <slot></slot>
      </Host>
    );
  }
}
