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
          <div class={"ls-field-properties-section"}>Format</div>
          <div class={"ls-field-properties-section"}>Placement</div>
          <div class={"ls-field-properties-section"}>Dimensions</div>
          <div class={"ls-field-properties-section"}>Advanced</div>
        <slot></slot>
      </Host>
    );
  }
}
