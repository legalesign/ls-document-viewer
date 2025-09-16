import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-image',
  styleUrl: 'ls-field-properties-image.css',
  shadow: true,
})
export class LsFieldPropertiesImage {
  @Prop() dataItem: LSApiElement;

  render() {
    return (
      <Host>
        <div class={"ls-field-properties-section"}>Image Properties</div>
        <div>Label: <input value={this.dataItem?.label} width="30"/></div>
        <ls-field-dimensions dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
