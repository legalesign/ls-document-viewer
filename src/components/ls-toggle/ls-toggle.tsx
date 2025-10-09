import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ls-toggle',
  styleUrl: 'ls-toggle.css',
  shadow: false,
})
export class LsToggle {
  @Prop() checked: boolean;
  @Prop() value: string;
  @Prop() onChange: (event: Event) => void;

  render() {
    return (
      <Host>
        <label class="switch">
          <input type="checkbox" value={this.value} checked={this.checked} onChange={this.onChange} />
          <span class="slider round"></span>
        </label>
        <slot></slot>
      </Host>
    );
  }
}
