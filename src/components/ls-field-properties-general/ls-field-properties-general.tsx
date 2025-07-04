import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-general',
  styleUrl: 'ls-field-properties-general.css',
  shadow: true,
})
export class LsFieldPropertiesGeneral {
  @Prop() dataItem: LSApiElement;

  render() {
    return (
      <Host>
        <div class={"ls-field-properties-section"}>General Field</div>
        <div>Label: <input value={this.dataItem?.label} width="30"/></div>
        <ls-field-dimensions dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
