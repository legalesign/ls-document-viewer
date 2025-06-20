import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-number',
  styleUrl: 'ls-field-properties-number.css',
  shadow: true,
})
export class LsFieldPropertiesNumber {
  @Prop() dataItem: LSApiElement;

  render() {
    return (
      <Host>
        <div class={"ls-field-properties-section"}>Number Field</div>
        <ls-field-dimensions dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
