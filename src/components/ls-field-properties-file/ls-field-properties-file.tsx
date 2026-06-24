import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';
import { LSApiRole } from '../../types/LSApiRole';

@Component({
  tag: 'ls-field-properties-file',
  styleUrl: 'ls-field-properties-file.scss',
  shadow: true,
})
export class LsFieldPropertiesFile {
  @Prop() dataItem: LSApiElement;
  @Prop() roles: LSApiRole[] = [];
  @Prop() readonly: boolean = false;
  @Prop() filtertoolbox: string = null;

  render() {
    return (
      <Host>
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'ls-dv-field-set'} slot="content">
            <ls-field-content dataItem={this.dataItem} roles={this.roles} readonly={this.readonly} filtertoolbox={this.filtertoolbox} />
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
