import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-feature-column',
  styleUrl: 'ls-feature-column.css',
  shadow: true,
})
export class LsFeatureColoumn {
  render() {
    return (
      <Host>
        <ls-icon name='document' size="36" />
        <ls-icon name='typing-input' size="36" />
        <ls-icon name='user-group' size="36" />        

        <slot></slot>
      </Host>
    );
  }
}
