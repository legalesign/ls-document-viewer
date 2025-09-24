import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-signature',
  styleUrl: 'ls-field-properties-signature.css',
  shadow: true,
})
export class LsFieldPropertiesSignature {
  @Prop() dataItem: LSApiElement;

  render() {
    return (
      <Host>
        <div class={'ls-field-properties-section'}>
          <div class={'ls-field-properties-section-text'}>
            <p class={'ls-field-properties-section-title'}>Field Type</p>
            <p class={'ls-field-properties-section-description'}>The Field you currently have selected</p>
          </div>
          <div class={'ls-field-type-wrapper'}>
            <div class={'ls-field-type-inner'}>
              <div class={'ls-field-type-icon'}>
                <ls-icon name="signature" size='20' />
              </div>
              <p class={'ls-field-type-name'}>Signature</p>
            </div>
          </div>
        </div>
        <div class={'ls-field-properties-section'}>
          <div class={'ls-field-properties-section-text'}>
            <p class={'ls-field-properties-section-title'}>Field Label</p>
            <p class={'ls-field-properties-section-description'}>Add a label to clarify the information required from the Recipient.</p>
          </div>
          <input value={this.dataItem?.label} width="30" />
        </div>
        <ls-field-dimensions dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
