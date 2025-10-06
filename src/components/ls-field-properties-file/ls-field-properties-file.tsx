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
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'field-set'} slot="content">
            <ls-field-content dataItem={this.dataItem} />
          </div>
          <div class={'field-set'} slot="dimensions">
            <ls-field-dimensions dataItem={this.dataItem} />
            <ls-field-properties-advanced dataItem={this.dataItem} />
          </div>
          <div class={'field-set'} slot="placement">
            <ls-field-placement dataItem={this.dataItem} />
          </div>
        </ls-field-properties-container>
        <ls-field-footer dataItem={this.dataItem} />
      </Host>
    );
  }
}
