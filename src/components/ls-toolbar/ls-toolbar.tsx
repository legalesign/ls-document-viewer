import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-toolbar',
  styleUrl: 'ls-toolbar.css',
  shadow: true,
})
export class LsToolbar {
    @Prop({
      mutable: true
    }) dataItem: LSApiElement[];
  render() {
    return (
      <Host>
        <ls-field-alignment dataItem={this.dataItem} />
        <ls-field-distribute dataItem={this.dataItem} />
        <ls-field-size  dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
