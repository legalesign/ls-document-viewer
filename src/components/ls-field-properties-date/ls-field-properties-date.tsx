import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';
import { LSApiRole } from '../../types/LSApiRole';

@Component({
  tag: 'ls-field-properties-date',
  styleUrl: 'ls-field-properties-date.scss',
  shadow: true,
})
export class LsFieldPropertiesDate {
  @Prop() dataItem: LSApiElement;
  @Prop() roles: LSApiRole[] = [];
  @Prop() readonly: boolean = false;

  render() {
    return (
      <Host>
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'ls-dv-field-set'} slot="content">
            <ls-field-content dataItem={this.dataItem} roles={this.roles} readonly={this.readonly} />
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
