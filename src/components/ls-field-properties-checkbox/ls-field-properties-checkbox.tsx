import { Component, Host, Prop, h, Listen, Element } from '@stencil/core';
import { LSApiElement } from '../../components';
import { LSMutateEvent } from '../../types/LSMutateEvent';

@Component({
  tag: 'ls-field-properties-checkbox',
  styleUrl: 'ls-field-properties-checkbox.scss',
  shadow: true,
})
export class LsFieldPropertiesCheckbox {
  @Prop({ mutable: true }) dataItem: LSApiElement;
  @Prop() readonly: boolean = false;

  @Listen('mutate')
  handleChildMutate(event: CustomEvent<LSMutateEvent[]>) {
    const update = event.detail?.[0];
    if (update?.action === 'update' && update.data) {
      this.dataItem = update.data as LSApiElement;
    }
  }

  @Element() el: HTMLElement;

  render() {
    return (
      <Host>
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'ls-dv-field-set'} slot="content">
            <ls-field-content dataItem={this.dataItem} showValidationTypes={true} readonly={this.readonly} />
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
