import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { validationTypes } from '../ls-document-viewer/editorUtils';

@Component({
  tag: 'ls-field-properties-general',
  styleUrl: 'ls-field-properties-general.css',
  shadow: true,
})
export class LsFieldPropertiesGeneral {
  @Prop() dataItem: LSApiElement;
  @Prop() fieldSet: 'content' | 'placement' | 'dimensions' = 'content';

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
              <ls-field-properties-advanced dataItem={this.dataItem} />
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
                      <ls-icon name="field-placement" size="20" />
                    </div>
                    <p class={'ls-field-type-name'}>General Field</p>
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

              <div class={'ls-field-properties-section'}>
                <div class={'ls-field-properties-section-text'}>
                  <p class={'ls-field-properties-section-title'}>Content Format</p>
                  <p class={'ls-field-properties-section-description'}>Select the specific format you want the Recipient to enter..</p>
                </div>
                <div class={'input-wrapper'}>
                  <ls-icon id="selectorIcon" name="selector"></ls-icon>
                  <select>
                    {validationTypes.map(type => (
                      <option selected={this.dataItem?.validation === type.id} value={type.value}>
                        {type.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        <ls-field-footer dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
