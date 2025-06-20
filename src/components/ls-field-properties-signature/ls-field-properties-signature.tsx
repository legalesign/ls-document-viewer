import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-signature',
  styleUrl: 'ls-field-properties-signature.css',
  shadow: true,
})
export class LsFieldPropertiesSignature {
  @Prop() dataItem: LSApiElement;

  render() {
    return ( 
      <Host>
          <ls-field-dimensions dataItem={this.dataItem} />
          <ls-field-format dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
