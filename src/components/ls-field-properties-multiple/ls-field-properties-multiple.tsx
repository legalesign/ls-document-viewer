import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { getFieldIcon } from '../ls-document-viewer/defaultFieldIcons';

@Component({
  tag: 'ls-field-properties-multiple',
  styleUrl: 'ls-field-properties-multiple.css',
  shadow: true,
})
export class LsFieldPropertiesMultiple {
  @Prop() dataItem: LSApiElement[];
  @Prop() fieldSet: 'content' | 'placement' | 'dimensions' = 'content';

  signerColor = (index: number) => {
    return index > 200 ? defaultRolePalette[index - 200] : index > 100 ? defaultRolePalette[index - 100] : defaultRolePalette[index] || defaultRolePalette[0];
  };

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
            <div class={'field-set'}>
              <ls-field-alignment dataItem={this.dataItem} />
              <ls-field-placement dataItem={this.dataItem} />
              <ls-field-distribute dataItem={this.dataItem} />

            </div>
          ) : this.fieldSet === 'dimensions' ? (
            <div class={'field-set'}>
              <ls-field-dimensions dataItem={this.dataItem} />
              <ls-field-size dataItem={this.dataItem} />
            </div>
          ) : (
            <div class={'field-set'}>
              <div class={'ls-field-properties-section'}>
                <div class={'ls-field-properties-section-text'}>
                  <p class={'ls-field-properties-section-title'}>Field Type</p>
                  <p class={'ls-field-properties-section-description'}>The Fields you currently have selected</p>
                </div>
                <div
                  class={'ls-field-type-wrapper'}
                  style={{
                    border: `1px dashed var(--${this.signerColor(this.allSignersSame().signer)}-30)`,
                    background: `var(--${this.signerColor(this.allSignersSame().signer)}-10)`,
                  }}
                >
                  <div class={'ls-field-type-inner'}>
                    <div
                      class={'ls-field-type-icon'}
                      style={{
                        border: `1px solid var(--${this.signerColor(this.allSignersSame().signer)}-60)`,
                        color: `var(--${this.signerColor(this.allSignersSame().signer)}-60)`,
                        background: `var(--${this.signerColor(this.allSignersSame().signer)}-10)`,
                      }}
                    >
                      <ls-icon name={getFieldIcon(this.allElementsSame().elementType)} size="20" />
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
                <ls-toggle />
              </div>

              <div class={'ls-field-properties-section'}>
                <div class={'ls-field-properties-section-text'}>
                  <p class={'ls-field-properties-section-title'}>Field Label</p>
                  <p class={'ls-field-properties-section-description'}>Add a label to clarify the information required from the Recipient.</p>
                </div>
                <input value={this.allLabelsSame().label} width="30" placeholder="eg. Sign Here" />
              </div>
            </div>
          )}
        </div>
        <ls-field-footer />
        

        <slot></slot>
      </Host>
    );
  }
}
