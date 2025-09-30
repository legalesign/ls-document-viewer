import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-signature',
  styleUrl: 'ls-field-properties-signature.css',
  shadow: true,
})
export class LsFieldPropertiesSignature {
  @Prop() dataItem: LSApiElement;
  @Prop() fieldSet: 'content' | 'placement' | 'dimensions' = 'content';

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
              <div class={'ls-field-type-wrapper'}>
                <div class={'ls-field-type-inner'}>
                  <div class={'ls-field-type-icon'}>
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

            <div class={'ls-field-properties-section'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Content Format</p>
                <p class={'ls-field-properties-section-description'}>Select the specific format you want the Recipient to enter..</p>
              </div>
              <div class={'input-wrapper'}>
                <ls-icon id="selectorIcon" name="selector"></ls-icon>
                <select>
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="signature">Signature</option>
                </select>
              </div>
            </div>
          </div>
        )}
        <div class={'button-footer'}>
          <button>Duplicate</button>
          <button>Delete</button>
        </div>

        <slot></slot>
      </Host>
    );
  }
}
