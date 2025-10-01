import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

@Component({
  tag: 'ls-field-properties-signature',
  styleUrl: 'ls-field-properties-signature.css',
  shadow: true,
})
export class LsFieldPropertiesSignature {
  @Prop() dataItem: LSApiElement;
  @Prop() fieldSet: 'content' | 'placement' | 'dimensions' = 'content';

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

  deleteField = () => {
    this.update.emit([{ action: 'delete', data: this.dataItem }]);
    this.mutate.emit([{ action: 'delete', data: this.dataItem }]);
  }

  duplicateField = () => {
    this.update.emit([{ action: 'create', data: { ...this.dataItem, id: btoa('ele' + crypto.randomUUID()) } }]);
    this.mutate.emit([{ action: 'create', data: { ...this.dataItem, id: btoa('ele' + crypto.randomUUID()) } }]);
  }

  signerColor = (index: number) => {
    return index > 200 ? defaultRolePalette[index - 200] : index > 100 ? defaultRolePalette[index - 100] : defaultRolePalette[index] || defaultRolePalette[0];
  };
  render() {
    return (
      <Host>
        <div class={'tabs-container'}>
          <button class={this.fieldSet === 'content' ? 'ls-tab active' : 'ls-tab'} onClick={() => (this.fieldSet = 'content')}>
            Content
          </button>
          <button class={this.fieldSet === 'placement' ? 'ls-tab active' : 'ls-tab'} onClick={() => (this.fieldSet = 'placement')}>
            Placement
          </button>
          <button class={this.fieldSet === 'dimensions' ? 'ls-tab active' : 'ls-tab'} onClick={() => (this.fieldSet = 'dimensions')}>
            Dimensions
          </button>
        </div>
        <div class={'scrolling-container'}>
          {this.fieldSet === 'placement' ? (
            <ls-field-placement dataItem={this.dataItem} />
          ) : this.fieldSet === 'dimensions' ? (
            <div class={'field-set'}>
              <ls-field-dimensions dataItem={this.dataItem} />
            </div>
          ) : (
            <div class={'field-set'}>
              <div class={'ls-field-properties-section'}>
                <div class={'ls-field-properties-section-text'}>
                  <p class={'ls-field-properties-section-title'}>Field Type</p>
                  <p class={'ls-field-properties-section-description'}>The Field you currently have selected</p>
                </div>
                <div
                  class={'ls-field-type-wrapper'}
                  style={{
                    border: `1px dashed var(--${this.signerColor(this.dataItem?.signer)}-30)`,
                    background: `var(--${this.signerColor(this.dataItem?.signer)}-10)`,
                  }}
                >
                  <div class={'ls-field-type-inner'}>
                    <div
                      class={'ls-field-type-icon'}
                      style={{
                        border: `1px solid var(--${this.signerColor(this.dataItem?.signer)}-60)`,
                        color: `var(--${this.signerColor(this.dataItem?.signer)}-60)`,
                        background: `var(--${this.signerColor(this.dataItem?.signer)}-10)`,
                      }}
                    >
                      <ls-icon name="signature" size="20" />
                    </div>
                    <p class={'ls-field-type-name'}>Signature</p>
                  </div>
                </div>
              </div>
              <div class={'ls-field-properties-section row'}>
                <div class={'ls-field-properties-section-text'}>
                  <p class={'ls-field-properties-section-title'}>Required Field</p>
                </div>
                <ls-toggle />
              </div>

              <div class={'ls-field-properties-section'}>
                <div class={'ls-field-properties-section-text'}>
                  <p class={'ls-field-properties-section-title'}>Field Label</p>
                  <p class={'ls-field-properties-section-description'}>Add a label to clarify the information required from the Recipient.</p>
                </div>
                <input value={this.dataItem?.label} width="30" placeholder="eg. Sign Here" />
              </div>
            </div>
          )}
        </div>
        <div class={'button-footer'}>
          <button class={'secondary'} onClick={() => this.duplicateField()}>
            <ls-icon name="field-duplicate" size="20" />
            Duplicate
          </button>
          <button class={'destructive'} onClick={() => this.deleteField()}>
            <ls-icon name="trash" size="20" />
            Delete
          </button>
        </div>

        <slot></slot>
      </Host>
    );
  }
}
