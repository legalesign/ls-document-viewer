import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-autosign',
  styleUrl: 'ls-field-properties-autosign.css',
  shadow: true,
})
export class LsFieldPropertiesAutosign {
  @Prop() dataItem: LSApiElement;
 
   render() {
     return (
       <Host>
         <div class={"ls-field-properties-section"}>Self Sign Field</div>
         <div>Label: <input value={this.dataItem?.label} width="30"/></div>
         <ls-field-dimensions dataItem={this.dataItem} />
         <ls-field-properties-advanced dataItem={this.dataItem} />

          <ls-field-footer dataItem={this.dataItem} />
         <slot></slot>
       </Host>
     );
   }
}
