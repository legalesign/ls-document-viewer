import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-image',
  styleUrl: 'ls-field-properties-image.scss',
  shadow: true,
})
export class LsFieldPropertiesImage {
  @Prop() dataItem: LSApiElement;
  @Prop() readonly: boolean = false;

  render() {
    return (
      <Host>
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'ls-dv-field-set'} slot="content">
            <ls-field-content dataItem={this.dataItem} readonly={this.readonly} />
            <ls-field-properties-advanced dataItem={this.dataItem} readonly={this.readonly} />
          </div>
          <div class={'ls-dv-field-set'} slot="dimensions">
            <ls-field-dimensions dataItem={this.dataItem} readonly={this.readonly} />
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
