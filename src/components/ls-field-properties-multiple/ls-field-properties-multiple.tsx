import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-multiple',
  styleUrl: 'ls-field-properties-multiple.css',
  shadow: true,
})
export class LsFieldPropertiesMultiple {
  @Prop() dataItem: LSApiElement[];

  render() {
    return (
      <Host>
        <ls-field-dimensions dataItem={dataItem}
        <slot></slot>
      </Host>
    );
  }
}
