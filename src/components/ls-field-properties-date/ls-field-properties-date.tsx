import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-date',
  styleUrl: 'ls-field-properties-date.css',
  shadow: true,
})
export class LsFieldPropertiesDate {
  @Prop() dataItem: LSApiElement;
  render() {
    return (
      <Host>
        <div class={"ls-field-properties-section"}>Date Field</div>
        <div class={"ls-field-properties-section"}>
          <div>Height: {this.dataItem[0]?.height}</div>
          <div>Width: {this.dataItem[0]?.width}</div>
          <div>Top: {this.dataItem[0]?.top}</div>
          <div>Left: {this.dataItem[0]?.left}</div>

        </div>
        <slot></slot>
      </Host>
    );
  }
}
