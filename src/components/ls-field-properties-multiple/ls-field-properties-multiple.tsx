import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { LSApiRole } from '../../types/LSApiRole';
import { dvI18n } from '../../i18n/i18n';
import { getDefaultValidationForType } from '../ls-field-type-select/fieldTypeUtils';


@Component({
  tag: 'ls-field-properties-multiple',
  styleUrl: 'ls-field-properties-multiple.scss',
  shadow: true,
})
export class LsFieldPropertiesMultiple {
  @Prop({ mutable: true }) dataItem: LSApiElement[];
  @Prop() roles: LSApiRole[] = [];
  @Prop() readonly: boolean = false;

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
    const typesWithoutValue = ['signature', 'initials', 'file', 'signing', 'autosign', 'signing date', 'auto sign', 'dropdown', 'checkbox', 'drawn field'];
    const fieldType = this.allFieldTypesSame().fieldType;
    return !typesWithoutValue.includes(fieldType);
  };

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
              <input value={this.allLabelsSame().label} onInput={(e) => this.alter({ label: (e.target as HTMLInputElement).value })} width="30" placeholder={this.allLabelsSame().isSame ? dvI18n.t('fieldproperties.placeholdersignhere') : dvI18n.t('fieldproperties.mixed')} disabled={this.readonly} />
            </div>

            {this.allFieldTypesSame().isSame && this.supportsValue() && (
              <div class={'ls-dv-field-properties-section'}>
                <div class={'ls-dv-field-properties-section-text'}>
                  <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.value')}</p>
                </div>
                <input value={this.allValuesSame().value} onInput={(e) => this.alter({ value: (e.target as HTMLInputElement).value })} placeholder={this.allValuesSame().isSame ? '' : dvI18n.t('fieldproperties.mixed')} disabled={this.readonly} />
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
