import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { LSApiRole } from '../../types/LSApiRole';
import { dvI18n } from '../../i18n/i18n';
import { getFieldPlaceholder } from '../ls-document-viewer/defaultFieldLabels';
@Component({
  tag: 'ls-field-properties-regex',
  styleUrl: 'ls-field-properties-regex.scss',
  shadow: true,
})
export class LsFieldPropertiesNumber {
  @Prop() dataItem: LSApiElement;
  @Prop() roles: LSApiRole[] = [];
  @Prop() readonly: boolean = false;
  @Prop() filtertoolbox: string = null;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  mutate: EventEmitter<LSMutateEvent[]>;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  update: EventEmitter<LSMutateEvent[]>;

  private labeltimer;

  debounce(data, delay) {
    if (this.labeltimer) clearTimeout(this.labeltimer);

    this.labeltimer = setTimeout(() => {
      const diffs: LSMutateEvent[] = [{ action: 'update', data }];
      this.mutate.emit(diffs);
    }, delay);
  }

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  // Debounced alter for text inputs (value, label, options)
  alter(diff: object) {
    this.dataItem = { ...this.dataItem, ...diff };
    this.update.emit([{ action: 'update', data: this.dataItem }]);
    this.debounce(this.dataItem, 1500);
  }

  render() {
    return (
      <Host>
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'ls-dv-field-set'} slot="content">
            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.expression')} sectionDescription={dvI18n.t('fieldproperties.expressiondescription')}>
              <ls-formfield
                as="text"
                name="field-value"
                value={this.dataItem?.value}
                placeholder={getFieldPlaceholder(this.dataItem?.formElementType)}
                disabled={this.readonly}
                onTextChange={e => this.alter({ options: e.detail.value })}
              />

            </ls-props-section>
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
