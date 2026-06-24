import { Component, Host, Prop, h, Event, EventEmitter, State, Watch } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { LSApiRole } from '../../types/LSApiRole';
import { dvI18n } from '../../i18n/i18n';
import { getDefaultValidationForType } from '../ls-field-type-select/fieldTypeUtils';
import { getFieldPlaceholder } from '../ls-document-viewer/defaultFieldLabels';
import { validationTypes } from '../ls-document-viewer/editorUtils';
import { validateFieldValue } from '../../utils/fieldValueValidator';
import { forceCloseDatePicker } from '../../utils/utils';


@Component({
  tag: 'ls-field-properties-multiple',
  styleUrl: 'ls-field-properties-multiple.scss',
  shadow: true,
})
export class LsFieldPropertiesMultiple {
  @Prop({ mutable: true }) dataItem: LSApiElement[];
  @Prop() roles: LSApiRole[] = [];
  @Prop() readonly: boolean = false;
  @Prop() filtertoolbox: string = null;
  @State() valueError: string | null = null;

  @Watch('dataItem')
  validateOnChange() {
    if (this.allFieldTypesSame().isSame && this.supportsValue() && this.allValuesSame().isSame) {
      this.valueError = validateFieldValue(
        this.allFieldTypesSame().fieldType,
        this.allValidationsSame().validation,
        this.allValuesSame().value,
        this.dataItem[0]?.options,
      );
    } else {
      this.valueError = null;
    }
  }

  componentWillLoad() {
    this.validateOnChange();
  }

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
    this.dataItem = this.dataItem.map(item => ({ ...item, ...diff }));
    const evs: LSMutateEvent[] = this.dataItem.map(item => ({ action: 'update', data: item }));
    this.update.emit(evs);
    this.debounce(diff, 1500);
  }

  // Immediate alter for non-typing actions (toggles, selects)
  alterImmediate(diff: object) {
    this.dataItem = this.dataItem.map(item => ({ ...item, ...diff }));
    if (this.labeltimer) {
      clearTimeout(this.labeltimer);
      this.labeltimer = null;
    }
    const evs: LSMutateEvent[] = this.dataItem.map(item => ({ action: 'update', data: item }));
    this.mutate.emit(evs);
    this.update.emit(evs);
  }

  private labeltimer;

  debounce(diff, delay) {
    if (this.labeltimer) clearTimeout(this.labeltimer);

    this.labeltimer = setTimeout(() => {
      const evs: LSMutateEvent[] = this.dataItem.map(item => ({ action: 'update', data: { ...item, ...diff } }));
      this.mutate.emit(evs);
      this.update.emit(evs);
    }, delay);
  }
  
  allSignersSame = () => {
    if (!this.dataItem || this.dataItem.length === 0) return { isSame: true, signer: undefined };
    const firstSigner = this.dataItem[0].signer;
    const allSame = this.dataItem.every(item => item.signer === firstSigner);
    return { isSame: allSame, signer: allSame ? firstSigner : 13 };
  };

  allLabelsSame = () => {
    if (!this.dataItem || this.dataItem.length === 0) return { isSame: true, label: undefined };
    const firstLabel = this.dataItem[0].label;
    const allSame = this.dataItem.every(item => item.label === firstLabel);
    return { isSame: allSame, label: allSame ? firstLabel : undefined };
  };

  allElementsSame = () => {
    if (!this.dataItem || this.dataItem.length === 0) return { isSame: true, elementType: 'mixed' };
    const firstElementType = this.dataItem[0].elementType;
    const allSame = this.dataItem.every(item => item.elementType === firstElementType);
    return { isSame: allSame, elementType: allSame ? firstElementType : 'mixed' };
  };

  allFieldTypesSame = () => {
    if (!this.dataItem || this.dataItem.length === 0) return { isSame: true, fieldType: 'text' };
    const firstType = this.dataItem[0].formElementType;
    const allSame = this.dataItem.every(item => item.formElementType === firstType);
    return { isSame: allSame, fieldType: allSame ? firstType : 'mixed' };
  };

  allValuesSame = () => {
    if (!this.dataItem || this.dataItem.length === 0) return { isSame: true, value: '' };
    const firstValue = this.dataItem[0].value || '';
    const allSame = this.dataItem.every(item => (item.value || '') === firstValue);
    return { isSame: allSame, value: allSame ? firstValue : '' };
  };

  supportsValue = () => {
    const typesWithoutValue = ['signature', 'initials', 'file', 'signing', 'autosign', 'signing date', 'auto sign', 'dropdown', 'checkbox', 'drawn field', 'date'];
    const fieldType = this.allFieldTypesSame().fieldType;
    return !typesWithoutValue.includes(fieldType);
  };

  isAllCheckboxes = () => {
    return this.allFieldTypesSame().isSame && this.allFieldTypesSame().fieldType === 'checkbox';
  };

  private getCheckboxStates(): string[] {
    if (!this.dataItem || this.dataItem.length === 0) return [];
    const vType = validationTypes.find(v => v.id === this.dataItem[0].validation);
    if (!vType) return [];
    return vType.description.split('/').reverse();
  }

  isDateType = () => {
    return this.allFieldTypesSame().fieldType === 'date';
  };

  allValidationsSame = () => {
    if (!this.dataItem || this.dataItem.length === 0) return { isSame: true, validation: 0 };
    const firstValidation = this.dataItem[0].validation;
    const allSame = this.dataItem.every(item => item.validation === firstValidation);
    return { isSame: allSame, validation: allSame ? firstValidation : null };
  };

  showContentFormat = () => {
    const fieldType = this.allFieldTypesSame().fieldType;
    const excluded = ['drawn field', 'regular expression', 'initials', 'signature', 'mixed'];
    return this.allFieldTypesSame().isSame && !excluded.includes(fieldType);
  };

  private getDateFormatById(validation: number): string | null {
    const vType = validationTypes.find(v => v.id === validation);
    if (!vType || vType.inputType !== 'date') return null;
    return vType.description;
  }

  private convertDateValue(currentValue: string, oldValidation: number, newValidation: number): string {
    if (!currentValue) return '';
    const oldFormat = this.getDateFormatById(oldValidation);
    const newFormat = this.getDateFormatById(newValidation);
    if (!oldFormat || !newFormat) return currentValue;

    const sep = oldFormat.match(/[/.-]/)?.[0] || '/';
    const parts = oldFormat.split(/[/.-]/);
    const valueParts = currentValue.split(sep);
    if (valueParts.length < 2) return currentValue;

    let y = '', m = '', d = '';
    parts.forEach((p, i) => {
      const v = valueParts[i] || '';
      if (p.startsWith('y')) y = v;
      else if (p.startsWith('m')) m = v;
      else if (p.startsWith('d')) d = v;
    });

    if (y.length === 2) y = '20' + y;
    if (!d) d = '01';

    return newFormat
      .replace('yyyy', y.padStart(4, '0'))
      .replace('yy', y.slice(-2))
      .replace('mm', m.padStart(2, '0'))
      .replace('dd', d.padStart(2, '0'))
      .replace('d', String(parseInt(d)));
  }

  private formatISOToValidation(isoValue: string, validation: number): string {
    if (!isoValue) return '';
    const [y, m, d] = isoValue.split('-');
    const format = this.getDateFormatById(validation);
    if (!format) return isoValue;

    return format
      .replace('yyyy', y)
      .replace('yy', y.slice(-2))
      .replace('mm', m)
      .replace('dd', d)
      .replace('d', String(parseInt(d)));
  }

  private toISODate(value: string, validation: number): string {
    if (!value) return '';
    const format = this.getDateFormatById(validation);
    if (!format) return value;

    const sep = format.match(/[/.-]/)?.[0] || '/';
    const parts = format.split(/[/.-]/);
    const valueParts = value.split(sep);
    if (valueParts.length < 2) return value;

    let y = '', m = '', d = '';
    parts.forEach((p, i) => {
      const v = valueParts[i] || '';
      if (p.startsWith('y')) y = v;
      else if (p.startsWith('m')) m = v;
      else if (p.startsWith('d')) d = v;
    });

    if (y.length === 2) y = '20' + y;
    if (!d) d = '01';

    return `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  handleFormatChange(newValidation: number) {
    if (this.isDateType()) {
      // Convert each field's date value to the new format
      this.dataItem = this.dataItem.map(item => ({
        ...item,
        validation: newValidation,
        value: this.convertDateValue(item.value || '', item.validation, newValidation),
      }));
    } else {
      this.dataItem = this.dataItem.map(item => ({ ...item, validation: newValidation }));
    }
    if (this.labeltimer) {
      clearTimeout(this.labeltimer);
      this.labeltimer = null;
    }
    const evs: LSMutateEvent[] = this.dataItem.map(item => ({ action: 'update', data: item }));
    this.mutate.emit(evs);
    this.update.emit(evs);
  }

  allFieldsOptional = () => {
    if (!this.dataItem || this.dataItem.length === 0) return { isSame: true, optional: false };
    const firstElementOptional = this.dataItem[0].optional;
    const allSame = this.dataItem.every(item => item.optional === firstElementOptional);
    return { isSame: allSame, optional: allSame ? firstElementOptional : false };
  };

  private hasSignatureType(): boolean {
    return this.dataItem?.some(item => item.formElementType === 'signature' || (item.formElementType as string) === 'auto sign');
  }

  private getAllRoleTypes(): string[] {
    const types = new Set<string>();
    for (const item of this.dataItem || []) {
      if (item.signer === 0) {
        types.add('SENDER');
      } else {
        const role = this.roles?.find(r => r.signerIndex === item.signer);
        types.add(role?.roleType || 'SIGNER');
      }
    }
    return [...types];
  }

  private handleFieldTypeChange(newType: string) {
    const defaultValidation = getDefaultValidationForType(newType);
    const noValueTypes = ['signature', 'initials', 'file', 'signing date', 'auto sign', 'date', 'dropdown', 'checkbox', 'drawn field'];
    const dateTypes = ['date', 'signing date'];

    this.dataItem = this.dataItem.map(item => {
      const currentType = item.formElementType as string;
      const shouldClearValue = noValueTypes.includes(newType) || dateTypes.includes(currentType);
      const isSender = item.signer === 0;
      let elementType: string;
      if (isSender) {
        elementType = 'admin';
      } else if (newType === 'signature') {
        elementType = 'signature';
      } else if (newType === 'initials') {
        elementType = 'initials';
      } else {
        elementType = 'text';
      }
      return { ...item, formElementType: newType as any, elementType, validation: defaultValidation, ...(shouldClearValue ? { value: '' } : {}) };
    });

    // Emit immediately — field type change is a discrete action, not continuous input
    if (this.labeltimer) clearTimeout(this.labeltimer);
    const evs: LSMutateEvent[] = this.dataItem.map(item => ({ action: 'update', data: item }));
    this.mutate.emit(evs);
    this.update.emit(evs);
  }

  private getSenderDisabledReason(): string {
    const signerOnly = ['signing date', 'regular expression', 'image', 'file', 'drawn', 'drawn field'];
    const nameMap = {
      'signing date': dvI18n.t('toolbox.signingdate'),
      'regex': dvI18n.t('toolbox.regex'),
      'regular expression': dvI18n.t('toolbox.regex'),
      'image': dvI18n.t('toolbox.image'),
      'file': dvI18n.t('toolbox.file'),
      'drawn': dvI18n.t('toolbox.drawn'),
      'drawn field': dvI18n.t('toolbox.drawn'),
    };
    const disallowedTypes = [...new Set(
      this.dataItem
        ?.filter(item => signerOnly.includes(item.formElementType as string))
        .map(item => nameMap[item.formElementType as string] || item.formElementType)
    )];
    if (disallowedTypes.length === 0) return '';
    const fieldTypes = disallowedTypes.length === 1
      ? disallowedTypes[0]
      : disallowedTypes.slice(0, -1).join(', ') + ' and ' + disallowedTypes[disallowedTypes.length - 1];
    return dvI18n.t('fieldproperties.cannotreassignsender', { fieldTypes });
  }

  private handleReassign(newSigner: number) {
    this.dataItem = this.dataItem.map(item => {
      const fieldType = item.formElementType as string;
      // Auto Sign reassigned away from Sender → becomes Signature
      if (fieldType === 'auto sign' && newSigner !== 0) {
        return { ...item, signer: newSigner, formElementType: 'signature' as const, elementType: 'signature', validation: 0 };
      }
      // Signature reassigned to Sender → becomes Auto Sign
      if (fieldType === 'signature' && newSigner === 0) {
        return { ...item, signer: newSigner, formElementType: 'auto sign' as any, elementType: 'admin', validation: 3000 };
      }
      // Any field reassigned to Sender → elementType becomes 'admin'
      if (newSigner === 0) {
        return { ...item, signer: newSigner, elementType: 'admin' };
      }
      // Any field reassigned away from Sender → revert elementType
      if (item.signer === 0) {
        const elType = (fieldType === 'initials') ? 'initials' : 'text';
        return { ...item, signer: newSigner, elementType: elType };
      }
      return { ...item, signer: newSigner };
    });

    if (this.labeltimer) clearTimeout(this.labeltimer);
    this.labeltimer = setTimeout(() => {
      const evs: LSMutateEvent[] = this.dataItem.map(item => ({ action: 'update', data: item }));
      this.mutate.emit(evs);
      this.update.emit(evs);
    }, 500);
  }

  render() {
    return (
      <Host>
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'ls-dv-field-set'} slot="content">
            {this.roles?.length > 0 && (
              <div class={'ls-dv-field-properties-section'}>
                <div class={'ls-dv-field-properties-section-text'}>
                  <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.assignee')}</p>
                  <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.assigneedescription')}</p>
                </div>
                <ls-assignee-select
                  signer={this.allSignersSame().signer}
                  roles={this.roles}
                  disabled={this.readonly}
                  disabledSenderReason={this.getSenderDisabledReason()}
                  disabledApproverReason={this.hasSignatureType() ? dvI18n.t('fieldproperties.signaturecannotapprover') : ''}
                  mixed={!this.allSignersSame().isSame}
                  onAssigneeChange={ev => this.handleReassign(ev.detail)}
                />
              </div>
            )}
            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.fieldtype')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.fieldtypedescriptionmultiple')}</p>
              </div>
              <ls-field-type-select
                fieldType={this.allFieldTypesSame().fieldType}
                assignee={this.allSignersSame().signer}
                roles={this.roles}
                roleTypes={this.getAllRoleTypes()}
                disabled={this.readonly}
                mixed={!this.allFieldTypesSame().isSame}
                filtertoolbox={this.filtertoolbox}
                onFieldTypeChange={ev => this.handleFieldTypeChange(ev.detail)}
              />
            </div>
            <div class={'ls-dv-field-properties-section ls-dv-row'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.requiredfield')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.requiredfielddescription')}</p>
              </div>
              <ls-toggle onValueChange={(ev) => !this.readonly && this.alterImmediate({ optional: !ev.detail })} checked={!this.allFieldsOptional().optional} indeterminate={this.allFieldsOptional().isSame === false} />
            </div>


            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.fieldlabel')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.fieldlabeldescription')}</p>
              </div>
              <ls-formfield
                as="text"
                name="field-label"
                value={this.allLabelsSame().label}
                placeholder={this.allLabelsSame().isSame ? dvI18n.t('fieldproperties.placeholdersignhere') : dvI18n.t('fieldproperties.mixed')}
                disabled={this.readonly}
                onTextChange={e => this.alter({ label: e.detail.value })}
              />
            </div>

            {this.allFieldTypesSame().isSame && this.supportsValue() && (
              <div class={'ls-dv-field-properties-section'}>
                <div class={'ls-dv-field-properties-section-text'}>
                  <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.value')}</p>
                  <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.valuedescription')}</p>
                </div>
                <ls-formfield
                  as="text"
                  name="field-value"
                  value={this.allValuesSame().value}
                  placeholder={this.allValuesSame().isSame ? getFieldPlaceholder(this.allFieldTypesSame().fieldType) : dvI18n.t('fieldproperties.mixed')}
                  valid={!this.valueError}
                  dirty={!!this.allValuesSame().value}
                  errorText={this.valueError}
                  disabled={this.readonly}
                  onTextChange={e => {
                    const val = e.detail.value;
                    this.valueError = validateFieldValue(
                      this.allFieldTypesSame().fieldType,
                      this.allValidationsSame().validation,
                      val,
                      this.dataItem[0]?.options,
                    );
                    this.alter({ value: val });
                  }}
                />
                {this.valueError && <p class={'ls-dv-error-text'}>{this.valueError}</p>}
              </div>
            )}

            {this.isAllCheckboxes() && this.getCheckboxStates().length === 2 && (
              <div class={'ls-dv-field-properties-section'}>
                <div class={'ls-dv-field-properties-section-text'}>
                  <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.displaystate')}</p>
                  <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.displaystatedescription')}</p>
                </div>
                <div class="ls-dv-checkbox-toggle">
                  {this.getCheckboxStates().map((state, idx) => (
                    <button
                      key={idx}
                      class={{ 'ls-dv-checkbox-toggle-btn': true, 'ls-dv-active': this.allValuesSame().isSame && (idx === 0 ? this.allValuesSame().value !== 'true' : this.allValuesSame().value === 'true') }}
                      onClick={() => !this.readonly && this.alterImmediate({ value: idx === 0 ? 'false' : 'true' })}
                      disabled={this.readonly}
                    >
                      {state}
                    </button>
                  ))}
                </div>
                {!this.allValuesSame().isSame && <p class={'ls-dv-mixed-hint'}>{dvI18n.t('fieldproperties.mixed')}</p>}
              </div>
            )}

            {this.allFieldTypesSame().isSame && this.isDateType() && (
              <div class={'ls-dv-field-properties-section'}>
                <div class={'ls-dv-field-properties-section-text'}>
                  <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.value')}</p>
                </div>
                <input
                  type="date"
                  value={this.allValuesSame().isSame ? this.toISODate(this.allValuesSame().value, this.dataItem[0].validation) : ''}
                  onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    // Convert ISO to each field's configured format
                    this.dataItem = this.dataItem.map(item => ({
                      ...item,
                      value: this.formatISOToValidation(input.value, item.validation),
                    }));
                    if (this.labeltimer) { clearTimeout(this.labeltimer); this.labeltimer = null; }
                    const evs: LSMutateEvent[] = this.dataItem.map(item => ({ action: 'update', data: item }));
                    this.mutate.emit(evs);
                    this.update.emit(evs);
                    forceCloseDatePicker(input);
                  }}
                  disabled={this.readonly}
                />
              </div>
            )}

            {this.showContentFormat() && (
              <div class={'ls-dv-field-properties-section'}>
                <div class={'ls-dv-field-properties-section-text'}>
                  <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.contentformat')}</p>
                  <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.contentformatdescription')}</p>
                </div>
                <ls-input-wrapper select>
                  <select
                    onChange={ev => !this.readonly && this.handleFormatChange(parseInt((ev.target as HTMLSelectElement).value))}
                    disabled={this.readonly}
                  >
                    {!this.allValidationsSame().isSame && (
                      <option disabled selected value="">{dvI18n.t('fieldproperties.mixed')}</option>
                    )}
                    {validationTypes
                      .filter(type => type.formType === this.allFieldTypesSame().fieldType)
                      .map(type => (
                        <option selected={this.allValidationsSame().validation === type.id} value={type.id}>
                          {type.description}
                        </option>
                      ))}
                  </select>
                </ls-input-wrapper>
              </div>
            )}
          </div>
          <div class={'ls-dv-field-set'} slot="dimensions">
            <ls-field-dimensions dataItem={this.dataItem} readonly={this.readonly} />
            <ls-field-size dataItem={this.dataItem} readonly={this.readonly} />
          </div>
          <div class={'ls-dv-field-set'} slot="placement">
            <ls-field-alignment dataItem={this.dataItem} readonly={this.readonly} />
            <ls-field-placement dataItem={this.dataItem} readonly={this.readonly} />
            <ls-field-distribute dataItem={this.dataItem} readonly={this.readonly} />
          </div>
        </ls-field-properties-container>
        <ls-field-footer dataItem={this.dataItem} readonly={this.readonly} />
        <slot></slot>
      </Host>
    );
  }
}
