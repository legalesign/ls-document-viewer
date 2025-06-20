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
        <div class={"ls-field-properties-section"}>
          <div>Height: {this.dataItem?.height}</div>
          <div>Width: {this.dataItem?.width}</div>
          <div>Top: {this.dataItem?.top}</div>
          <div>Left: {this.dataItem?.left}</div>

        </div>
        <slot></slot>
      </Host>
    );
  }
}
