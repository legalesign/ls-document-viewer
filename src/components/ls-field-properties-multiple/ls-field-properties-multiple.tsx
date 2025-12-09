import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { getFieldIcon } from '../ls-document-viewer/defaultFieldIcons';

@Component({
  tag: 'ls-field-properties-multiple',
  styleUrl: 'ls-field-properties-multiple.css',
  shadow: true,
})
export class LsFieldPropertiesMultiple {
  @Prop({ mutable: true }) dataItem: LSApiElement[]; 

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
          <div class={'field-set'} slot="content">
            <div class={'ls-field-properties-section'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Field Type</p>
                <p class={'ls-field-properties-section-description'}>The Fields you currently have selected</p>
              </div>
              <div
                class={'ls-field-type-wrapper'}
                style={{
                  border: `1px dashed ${defaultRolePalette[this.allSignersSame().signer % 100].s30}`,
                  background: defaultRolePalette[this.allSignersSame().signer % 100].s10,
                }}
              >
                <div class={'ls-field-type-inner'}>
                  <div
                    class={'ls-field-type-icon'}
                    style={{
                      border: `1px solid ${defaultRolePalette[this.allSignersSame().signer % 100].s60}`,
                      color: defaultRolePalette[this.allSignersSame().signer % 100].s60,
                      background: defaultRolePalette[this.allSignersSame().signer % 100].s10,
                    }}
                  >
                    <ls-icon name={getFieldIcon(this.allElementsSame().elementType)} size="1.25rem" />
                  </div>
                  <p class={'ls-field-type-name'}>
                    {this.dataItem.length} {this.allElementsSame().elementType} {'Fields'}
                  </p>
                </div>
              </div>
            </div>
            <div class={'ls-field-properties-section row'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Required Field</p>
              </div>
              <ls-toggle onValueChange={(ev) => this.alter({ optional: !ev.detail })} checked={!this.allFieldsOptional().optional} indeterminate={this.allFieldsOptional().isSame === false} />
            </div>

            <div class={'ls-field-properties-section'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Field Label</p>
                <p class={'ls-field-properties-section-description'}>Add a label to clarify the information required from the Recipient.</p>
              </div>
              <input value={this.allLabelsSame().label} onInput={(e) => this.alter({ label: (e.target as HTMLInputElement).value })} width="30" placeholder="eg. Sign Here" />
            </div>
          </div>
          <div class={'field-set'} slot="dimensions">
            <ls-field-dimensions dataItem={this.dataItem} />
            <ls-field-size dataItem={this.dataItem} />
          </div>
          <div class={'field-set'} slot="placement">
            <ls-field-alignment dataItem={this.dataItem} />
            <ls-field-placement dataItem={this.dataItem} />
            <ls-field-distribute dataItem={this.dataItem} />
          </div>
        </ls-field-properties-container>
        <ls-field-footer />
        <slot></slot>
      </Host>
    );
  }
}
