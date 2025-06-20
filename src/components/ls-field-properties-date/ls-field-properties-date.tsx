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
        <ls-field-dimensions dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
