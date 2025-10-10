import { Component, Host, Prop, h } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

@Component({
  tag: 'ls-validation-tag',
  styleUrl: 'ls-validation-tag.css',
  shadow: true,
})
export class LsValidationTag {
  @Prop() isValid: boolean = false;
  @Prop() requiredFields: any[] = [];
  @Prop() isExpanded: boolean = false;

  render() {
    return (
      <Host>
        <div class={`valid-label ${this.isValid ? 'valid' : 'invalid'}`} onClick={!this.isValid && (() => (this.isExpanded = !this.isExpanded))}>
          {this.isValid ? 'Ready to Send' : `Requires Fields`}
          {!this.isValid && <div class={'field-counter'}>{this.requiredFields.length}</div>}
          {!this.isValid && <ls-icon name={this.isExpanded ? 'chevron-up' : 'chevron-down'} style={{ cursor: 'pointer', scale: '0.60', margin: '0 -0.25rem' }} />}
        </div>
        {this.isExpanded && (
          <div class={'field-dropdown'}>
            <div class={'dropdown-header'}>
              <h2>Signature Fields Required</h2>
              <p>
                {this.requiredFields.length} {this.requiredFields.length === 1 ? 'Recipient needs a Signature Field' : 'Recipients need Signature Fields'} placed for them
              </p>
            </div>
            {this.requiredFields.map((field, idx) => (
              <div
                key={idx}
                class={'required-field'}
                style={{
                  '--field-background': defaultRolePalette[field.signer.signerIndex || 0].s10,
                  '--field-border-color': defaultRolePalette[field.signer.signerIndex || 0].s10,
                  '--field-background-hover': defaultRolePalette[field.signer.signerIndex || 0].s20,
                  '--field-text-color': defaultRolePalette[field.signer.signerIndex || 0].s70,
                  '--field-text-color-hover': defaultRolePalette[field.signer.signerIndex || 0].s80,
                  '--field-border-color-hover': defaultRolePalette[field.signer.signerIndex || 0].s60,
                }}
              >
                <div class={'required-field-items-left'}>
                  <div class={'dot'} style={{ background: defaultRolePalette[field.signer.signerIndex || 0].s60 }} />
                  <p style={{ color: defaultRolePalette[field.signer.signerIndex || 0].s80 }}>{field.signer?.name || `Signer ${field.signer?.signerIndex + 1}`}</p>
                  <div
                    class={'role-label'}
                    style={{ background: defaultRolePalette[field.signer.signerIndex || 0].s30, color: defaultRolePalette[field.signer.signerIndex || 0].s70 }}
                  >
                    {field.signer?.roleType || `Signer ${field.signer?.signerIndex + 1}`}
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
