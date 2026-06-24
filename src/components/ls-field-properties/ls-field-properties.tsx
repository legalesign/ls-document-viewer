import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';

@Component({
  tag: 'ls-field-properties',
  styleUrl: 'ls-field-properties.scss',
  shadow: true,
})
export class LsFieldProperties {
  @Prop() dataItem: LSApiElement[];
  @Prop() template: any; // LSApiTemplate
  @Prop() readonly: boolean = false;
  @Prop() filtertoolbox: string = null;

  renderFields() {
    if (this.dataItem && this.dataItem?.length === 1) {
      const roles = this.template?.roles || [];
      switch (this.dataItem[0].formElementType) {
        case 'signature':
          return <ls-field-properties-signature dataItem={this.dataItem[0]} template={this.template} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        case 'date':
          return <ls-field-properties-date dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        case 'signing date':
          return <ls-field-properties-date dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        case 'text':
          return <ls-field-properties-text dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        case 'number':
          return <ls-field-properties-number dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        case 'autosign':
          return <ls-field-properties-autosign dataItem={this.dataItem[0]} readonly={this.readonly} />
        case 'email':
          return <ls-field-properties-email dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        case 'file':
          return <ls-field-properties-file dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        case 'dropdown':
          return <ls-field-properties-file dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        case 'checkbox':
          return <ls-field-properties-checkbox dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />
        default:
          return <ls-field-properties-general dataItem={this.dataItem[0]} readonly={this.readonly} roles={roles} filtertoolbox={this.filtertoolbox} />

      }
    } else if (this.dataItem && this.dataItem?.length > 1)
      return <ls-field-properties-multiple dataItem={this.dataItem} readonly={this.readonly} roles={this.template?.roles || []} filtertoolbox={this.filtertoolbox} />

  }

  private handleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    event.stopPropagation();
  }

  render() {
    return (
      <Host onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
        {this.dataItem && this.renderFields()}
        <slot></slot>
      </Host>
    );
  }
}
