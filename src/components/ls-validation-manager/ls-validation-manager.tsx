import { Component, Host, Prop, h } from '@stencil/core';
import { ValidationError } from '../../types/ValidationError';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

@Component({
  tag: 'ls-validation-manager',
  styleUrl: 'ls-validation-manager.css',
  shadow: true,
})

export class LsValidationManager {

  /**
   * The template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop() validationErrors: ValidationError[];

  render() {
    return (
      <Host>
        <div>
          <div>
            <h2>Fields Required</h2>
            <p>
              Document needs fields added or corrected before it can be sent
            </p>
          </div>
          {this.validationErrors.map((field, idx) => {
            const signerIndex = field?.role?.signerIndex ? field?.role?.signerIndex % 100 : null;
            const pallette = defaultRolePalette[signerIndex || field?.element?.signer || 0];

            return (
              <div
                key={idx}
                class={'required-field'}
                style={{
                  '--field-background': pallette.s10,
                  '--field-border-color': pallette.s10,
                  '--field-background-hover': pallette.s20,
                  '--field-text-color': pallette.s70,
                  '--field-text-color-hover': pallette.s80,
                  '--field-border-color-hover': pallette.s60,
                }}
              >
                <div class={'required-field-items-left'}>
                  <div class={'dot'} style={{ background: pallette.s60 }} />
                  {field?.role && (
                    <div class={'required-field-items-left'}>
                      <p style={{ color: pallette.s80 }}>{field.role?.name || `Signer ${field?.role?.signerIndex + 1}`}</p>
                      <div class={'role-label'} style={{ background: pallette.s30, color: pallette.s70 }}>
                        {field.role?.roleType.toLowerCase() || `Signer ${field.role?.signerIndex + 1}`}
                      </div>
                    </div>
                  )}
                  {field?.element && (
                    <>
                     <ls-toolbox-field
                          elementType="signature"
                          formElementType="signature"
                          label="Signature"
                          defaultHeight={27}
                          defaultWidth={120}
                          validation={0}
                          icon="signature"
                          tooltip="Use this field to collect Signatures from Participants"
                          signer={field.element.signer}
                        />

                      <p style={{ color: pallette.s80 }}>{field.role?.name || `${field.element.formElementType} ${field?.element?.label + 1}`}</p>
                      <div class={'role-label'} style={{ background: pallette.s30, color: pallette.s70 }}>
                        {field.description}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <slot></slot>
      </Host>
    );
  }
}
