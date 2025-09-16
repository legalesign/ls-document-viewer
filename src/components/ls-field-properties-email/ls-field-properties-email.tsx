import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-email',
  styleUrl: 'ls-field-properties-email.css',
  shadow: true,
})
export class LsFieldPropertiesEmail {
    @Prop() dataItem: LSApiElement;
  
    render() {
      return (
        <Host>
          <div class={"ls-field-properties-section"}>Email Field</div>
          <div>Label: <input value={this.dataItem?.label} width="30"/></div>
          <ls-field-dimensions dataItem={this.dataItem} />
          <slot></slot>
        </Host>
      );
    }
}
