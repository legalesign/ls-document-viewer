import { Component, Host, Prop, h } from '@stencil/core';
import { ValidationError } from '../../types/ValidationError';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { dvI18n } from '../../i18n/i18n';
import { FIELD_DEFAULTS } from '../../constants/fieldDefaults';

@Component({
  tag: 'ls-validation-manager',
  styleUrl: 'ls-validation-manager.scss',
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
            <div class={'ls-dv-validation-section-title'}>{dvI18n.t('common.actionrequired')}</div>
            <p class="ls-dv-toolbox-section-description">
              {dvI18n.t('validation.description')}
            </p>
          </div>
          {this.validationErrors && this.validationErrors.map((field, idx) => {
            const signerIndex = field?.role?.signerIndex ? field?.role?.signerIndex % 100 : null;
            const pallette = defaultRolePalette[signerIndex || field?.element?.signer || 0];

            return (
              <div
                key={idx}
                class={'ls-dv-required-field'}
                style={{
                  '--field-background': pallette.s10,
                  '--field-border-color': pallette.s10,
                  '--field-background-hover': pallette.s20,
                  '--field-text-color': pallette.s70,
                  '--field-text-color-hover': pallette.s80,
                  '--field-border-color-hover': pallette.s60,
                }}
              >
                <div class={'ls-dv-required-field-items-left'}>
                  <div class={'ls-dv-dot'} style={{ background: pallette.s60 }} />
                  {field?.role && (
                    <div class={'ls-dv-required-field-items-left'}>
                      <p style={{ color: pallette.s80 }}>{field.role?.name || `Signer ${field?.role?.signerIndex + 1}`}</p>
                      <div class={'ls-dv-role-label'} style={{ background: pallette.s30, color: pallette.s70 }}>
                        {field.role?.roleType ? dvI18n.t(`participants.${field.role.roleType.toLowerCase()}`) : `Signer ${field.role?.signerIndex + 1}`}
                      </div>
                    </div>
                  )}
                  {field?.element && (
                    <>
                     <ls-toolbox-field
                          elementType="signature"
                          formElementType="signature"
                          label={dvI18n.t('toolbox.signature')}
                          defaultHeight={FIELD_DEFAULTS['signature'].defaultHeight}
                          defaultWidth={FIELD_DEFAULTS['signature'].defaultWidth}
                          validation={0}
                          icon="signature-icon"
                          tooltip={dvI18n.t('toolbox.signaturetooltip')}
                          signer={field.element.signer}
                        />

                      <p style={{ color: pallette.s80 }}>{field.role?.name || `${field.element.formElementType} ${field?.element?.label + 1}`}</p>
                      <div class={'ls-dv-role-label'} style={{ background: pallette.s30, color: pallette.s70 }}>
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
