import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { getFieldIcon } from '../ls-document-viewer/defaultFieldIcons';
import { dvI18n } from '../../i18n/i18n';

const fieldTypeKeyMap: { [key: string]: string } = {
  'signature': 'toolbox.signature',
  'auto sign': 'toolbox.autosign',
  'text': 'toolbox.text',
  'signing date': 'toolbox.signingdate',
  'date': 'toolbox.date',
  'initials': 'toolbox.initials',
  'checkbox': 'toolbox.checkbox',
  'email': 'toolbox.email',
  'number': 'toolbox.number',
  'dropdown': 'toolbox.dropdown',
  'file': 'toolbox.file',
  'drawn field': 'toolbox.drawn',
  'regular expression': 'toolbox.regex',
  'regex': 'toolbox.regex',
  'mixed': 'common.fields',
};

@Component({
  tag: 'ls-field-properties-multiple',
  styleUrl: 'ls-field-properties-multiple.scss',
  shadow: true,
})
export class LsFieldPropertiesMultiple {
  @Prop({ mutable: true }) dataItem: LSApiElement[];
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
    this.debounce(diff, 500);
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

  allFieldsOptional = () => {
    if (!this.dataItem || this.dataItem.length === 0) return { isSame: true, optional: false };
    const firstElementOptional = this.dataItem[0].optional;
    const allSame = this.dataItem.every(item => item.optional === firstElementOptional);
    return { isSame: allSame, optional: allSame ? firstElementOptional : false };
  };

  render() {
    return (
      <Host>
        <ls-field-properties-container tabs={['content', 'placement', 'dimensions']}>
          <div class={'ls-dv-field-set'} slot="content">
            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.fieldtype')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.fieldtypedescriptionmultiple')}</p>
              </div>
              <div
                class={'ls-dv-field-type-wrapper'}
                style={{
                  border: `1px dashed ${defaultRolePalette[this.allSignersSame().signer % 100].s30}`,
                  background: defaultRolePalette[this.allSignersSame().signer % 100].s10,
                }}
              >
                <div class={'ls-dv-field-type-inner'}>
                  <div
                    class={'ls-dv-field-type-icon'}
                    style={{
                      border: `1px solid ${defaultRolePalette[this.allSignersSame().signer % 100].s60}`,
                      color: defaultRolePalette[this.allSignersSame().signer % 100].s60,
                      background: defaultRolePalette[this.allSignersSame().signer % 100].s10,
                    }}
                  >
                    <ls-icon name={getFieldIcon(this.allElementsSame().elementType) as any} size={20} />
                  </div>
                  <p class={'ls-dv-field-type-name'}>
                    {this.dataItem.length} {dvI18n.t(fieldTypeKeyMap[this.allElementsSame().elementType] || 'common.fields')} {dvI18n.t('common.fields')}
                  </p>
                </div>
              </div>
            </div>
            <div class={'ls-dv-field-properties-section ls-dv-row'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.requiredfield')}</p>
              </div>
              <ls-toggle onValueChange={(ev) => !this.readonly && this.alter({ optional: !ev.detail })} checked={!this.allFieldsOptional().optional} indeterminate={this.allFieldsOptional().isSame === false} />
            </div>

            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('fieldproperties.fieldlabel')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('fieldproperties.fieldlabeldescription')}</p>
              </div>
              <input value={this.allLabelsSame().label} onInput={(e) => this.alter({ label: (e.target as HTMLInputElement).value })} width="30" placeholder={dvI18n.t('fieldproperties.placeholdersignhere')} disabled={this.readonly} />
            </div>
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
