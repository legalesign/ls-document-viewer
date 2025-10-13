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
  @Prop() isExpanded: boolean = false;

  render() {
    return (
      <Host>
        <div class={`valid-label ${this.validationErrors.length === 0 ? 'valid' : 'invalid'}`} onClick={this.status !== 'Valid' && (() => (this.isExpanded = !this.isExpanded))}>
          {this.validationErrors.length === 0 ? 'Ready to Send' : `Requires Fields`}
          {this.validationErrors.length > 0 && <div class={'field-counter'}>{this.validationErrors.length}</div>}
          {this.validationErrors.length > 0 && <ls-icon name={this.isExpanded ? 'chevron-up' : 'chevron-down'} style={{ cursor: 'pointer', scale: '0.60', margin: '0 -0.25rem' }} />}
        </div>
        {this.isExpanded && (
          <div class={'field-dropdown'}>
            <div class={'dropdown-header'}>
              <h2>Signature Fields Required</h2>
              <p>
                {this.validationErrors.length} {this.validationErrors.length === 1 ? 'Recipient needs a Signature Field' : 'Recipients need Signature Fields'} placed for them
              </p>
            </div>
            {this.validationErrors.map((field, idx) => (
              <div
                key={idx}
                class={'required-field'}
                style={{
                  '--field-background': defaultRolePalette[field.role.signerIndex || 0].s10,
                  '--field-border-color': defaultRolePalette[field.role.signerIndex || 0].s10,
                  '--field-background-hover': defaultRolePalette[field.role.signerIndex || 0].s20,
                  '--field-text-color': defaultRolePalette[field.role.signerIndex || 0].s70,
                  '--field-text-color-hover': defaultRolePalette[field.role.signerIndex || 0].s80,
                  '--field-border-color-hover': defaultRolePalette[field.role.signerIndex || 0].s60,
                }}
              >
                <div class={'required-field-items-left'}>
                  <div class={'dot'} style={{ background: defaultRolePalette[field.role.signerIndex || 0].s60 }} />
                  <p style={{ color: defaultRolePalette[field.role.signerIndex || 0].s80 }}>{field.role?.name || `Signer ${field.role?.signerIndex + 1}`}</p>
                  <div
                    class={'role-label'}
                    style={{ background: defaultRolePalette[field.role.signerIndex || 0].s30, color: defaultRolePalette[field.role.signerIndex || 0].s70 }}
                  >
                    {field.role?.roleType || `Signer ${field.role?.signerIndex + 1}`}
                  </div>
                </div>
                <ls-icon name="chevron-right" />
              </div>
            ))}
          </div>
        )}
      </Host>
    );
  }
}
