import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-autosign',
  styleUrl: 'ls-field-properties-autosign.scss',
  shadow: true,
})
export class LsFieldPropertiesAutosign {
  @Prop() dataItem: LSApiElement;
  @Prop() readonly: boolean = false;
 
   render() {
     return (
       <Host>
         <div class={"ls-dv-field-properties-section"}>Self Sign Field</div>
         <div>Label: <input value={this.dataItem?.label} width="30"/></div>
         <ls-field-dimensions dataItem={this.dataItem} readonly={this.readonly} />
         <ls-field-properties-advanced dataItem={this.dataItem} readonly={this.readonly} />

          <ls-field-footer dataItem={this.dataItem} readonly={this.readonly} />
         <slot></slot>
       </Host>
     );
   }
}
