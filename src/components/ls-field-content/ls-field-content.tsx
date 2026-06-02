import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { validationTypes } from '../ls-document-viewer/editorUtils';
import { getFieldPlaceholder, getFieldTitleSuggestion } from '../ls-document-viewer/defaultFieldLabels';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-field-content',
  styleUrl: 'ls-field-content.scss',
  shadow: true,
})
export class LsFieldContent {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement;
  @Prop() showValidationTypes: boolean = true;

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

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  // NOTE this alter is debounced to account for typing
  alter(diff: object) {
    this.dataItem = { ...this.dataItem, ...diff };
    this.debounce(this.dataItem, 500);
  }

  private labeltimer;

  debounce(data, delay) {
    if (this.labeltimer) clearTimeout(this.labeltimer);

    this.labeltimer = setTimeout(() => {
      const diffs: LSMutateEvent[] = [{ action: 'update', data }];
      this.mutate.emit(diffs);
    }, delay);
  }

  supportsValue() {
    const typesWithValue = ['signature', 'initials', 'image', 'file', 'signing', 'autosign', 'regex', 'signing date', 'auto sign', 'dropdown', 'checkbox'];

    return !typesWithValue.includes(this.dataItem?.formElementType);
  }

  render() {
    return (
      <Host>
        <ls-props-section sectionTitle={dvI18n.t('fieldproperties.fieldtype')} sectionDescription={dvI18n.t('fieldproperties.fieldtypedescription')}>
          <ls-field-type-display fieldType={this.dataItem?.formElementType} assignee={this.dataItem?.signer} />
        </ls-props-section>
        <ls-props-section sectionTitle={dvI18n.t('fieldproperties.requiredfield')} row={true}>
          <ls-toggle id="toggle-required" checked={!this.dataItem?.optional} onValueChange={ev => this.alter({ optional: !ev.detail })} />
        </ls-props-section>
        <ls-props-section sectionTitle={dvI18n.t('fieldproperties.fieldlabel')} sectionDescription={dvI18n.t('fieldproperties.fieldlabeldescription')}>
          <input
            value={this.dataItem?.label}
            placeholder={getFieldTitleSuggestion(this.dataItem?.formElementType)}
            onInput={e => this.alter({ label: (e.target as HTMLInputElement).value })}
          />
        </ls-props-section>
        {this.supportsValue() && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.value')} sectionDescription={dvI18n.t('fieldproperties.valuedescription')}>
            <input
              value={this.dataItem?.value}
              placeholder={getFieldPlaceholder(this.dataItem?.formElementType)}
              onInput={e => this.alter({ value: (e.target as HTMLInputElement).value })}
            />
          </ls-props-section>
        )}
        {this.dataItem.validation === 20 && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.options')} sectionDescription={dvI18n.t('fieldproperties.optionsdescription')}>
            <textarea
              value={this.dataItem?.options}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              onInput={e => this.alter({ options: (e.target as HTMLTextAreaElement).value })}
            />
          </ls-props-section>
        )}

        {this.showValidationTypes && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.contentformat')} sectionDescription={dvI18n.t('fieldproperties.contentformatdescription')}>
            <ls-input-wrapper select>
              <select onChange={ev => this.alter({ validation: parseInt((ev.target as HTMLSelectElement).value) })}>
                {validationTypes
                  .filter(type => type.formType === this.dataItem?.formElementType)
                  .map(type => (
                    <option selected={this.dataItem?.validation === type.id} value={type.id}>
                      {type.description}
                    </option>
                  ))}
              </select>
            </ls-input-wrapper>
          </ls-props-section>
        )}
        <slot></slot>
      </Host>
    );
  }
}
