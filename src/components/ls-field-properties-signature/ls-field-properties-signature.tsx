import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-signature',
  styleUrl: 'ls-field-properties-signature.scss',
  shadow: true,
})
export class LsFieldPropertiesSignature {
  @Prop() dataItem: LSApiElement;
  @Prop() template: any; // LSApiTemplate
  @Prop() readonly: boolean = false;

  render() {
    return (
      <Host>
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'ls-dv-field-set'} slot="content">
            <ls-field-content dataItem={this.dataItem} showValidationTypes={false} readonly={this.readonly} />
            <ls-field-properties-advanced dataItem={this.dataItem} readonly={this.readonly} />
          </div>
          <div class={'ls-dv-field-set'} slot="dimensions">
            <ls-field-dimensions dataItem={this.dataItem} template={this.template} readonly={this.readonly} />
          </div>
          <div class={'ls-dv-field-set'} slot="placement">
            <ls-field-placement dataItem={this.dataItem} readonly={this.readonly} />
          </div>
        </ls-field-properties-container>
        <ls-field-footer dataItem={this.dataItem} readonly={this.readonly} />
      </Host>
    );
  }
}
