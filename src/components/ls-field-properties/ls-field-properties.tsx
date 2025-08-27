import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';

@Component({
  tag: 'ls-field-properties',
  styleUrl: 'ls-field-properties.css',
  shadow: true,
})
export class LsFieldProperties {
  @Prop() dataItem: LSApiElement[];

  renderFields() {
    if (this.dataItem && this.dataItem?.length === 1) {
      console.log(this.dataItem)
      switch (this.dataItem[0].formElementType) {
        case 'signature':
          return <ls-field-properties-signature dataItem={this.dataItem[0]} />
        case 'date':
          return <ls-field-properties-date dataItem={this.dataItem[0]} />
        case 'autodate':
          return <ls-field-properties-date dataItem={this.dataItem[0]} />
        case 'text':
          return <ls-field-properties-text dataItem={this.dataItem[0]} />
        case 'number':
          return <ls-field-properties-number dataItem={this.dataItem[0]} />
        default:
          return <ls-field-properties-general dataItem={this.dataItem[0]} />

      }
    } else if (this.dataItem && this.dataItem?.length > 1)
      return <ls-field-properties-multiple dataItem={this.dataItem} />

  }

  render() {
    return (
      <Host>
        {this.dataItem && this.renderFields()}
        <slot></slot>
      </Host>
    );
  }
}
