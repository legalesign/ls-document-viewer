import { Component, Host, Prop, h } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { ValidationError } from '../../types/ValidationError';

@Component({
  tag: 'ls-validation-tag',
  styleUrl: 'ls-validation-tag.css',
  shadow: true,
})
export class LsValidationTag {
  @Prop({ mutable: true }) status: string = 'Invalid';
  @Prop({ mutable: true }) validationErrors: ValidationError[] = [];
  @Prop({ mutable: true }) isExpanded: boolean = false;

  render() {
    return (
      <Host>
        <div
          class={`valid-label ${this.validationErrors.length === 0 ? 'valid' : 'invalid'}`}
          onClick={this.validationErrors.length && (() => (this.isExpanded = !this.isExpanded))}
        >
          {this.validationErrors.length === 0 ? 'Ready to Send' : `Requires Fields`}
          {this.validationErrors.length > 0 && <div class={'field-counter'}>{this.validationErrors.length}</div>}
          {this.validationErrors.length > 0 && (
            <ls-icon name={this.isExpanded ? 'chevron-up' : 'chevron-down'} style={{ cursor: 'pointer', scale: '0.60', margin: '0 -0.25rem' }} />
          )}
        </div>
        {this.isExpanded && this.validationErrors.length !== 0 && (
          <div class={'field-dropdown'}>
            <div class={'dropdown-header'}>
              <h2>Signature Fields Required</h2>
              <p>
                {this.validationErrors.length} {this.validationErrors.length === 1 ? 'Recipient needs a Signature Field' : 'Recipients need Signature Fields'} placed for them
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
        )}
      </Host>
    );
  }
}
