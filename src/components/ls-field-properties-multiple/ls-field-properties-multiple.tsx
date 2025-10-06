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
