import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-text',
  styleUrl: 'ls-field-properties-text.css',
  shadow: true,
})
export class LsFieldPropertiesText {
  @Prop() dataItem: LSApiElement;
  render() {
    return (
      <Host>
        <div class={"ls-field-properties-section"}>Text Field</div>
        <div>Label: <input value={this.dataItem?.label} width="30"/></div>
        <ls-field-dimensions dataItem={this.dataItem}/>
        <ls-field-format dataItem={this.dataItem}/>
        <slot></slot>
      </Host>
    );
  }
}
