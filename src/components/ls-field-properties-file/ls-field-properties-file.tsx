import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-file',
  styleUrl: 'ls-field-properties-file.css',
  shadow: true,
})
export class LsFieldPropertiesFile {
  @Prop() dataItem: LSApiElement;
    
  render() {
    return (
         <Host>
           <div class={"ls-field-properties-section"}>File Properties</div>
           <div>Label: <input value={this.dataItem?.label} width="30"/></div>
           <ls-field-dimensions dataItem={this.dataItem} />
           <slot></slot>
         </Host>
       );
  }
}
