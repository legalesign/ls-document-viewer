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
        <div>{this.dataItem.length} items</div>
        <ls-field-dimensions dataItem={this.dataItem} />

        <slot></slot>
      </Host>
    );
  }
}
