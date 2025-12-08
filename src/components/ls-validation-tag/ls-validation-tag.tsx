import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
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
  @Prop() type: 'compose' | 'default' = 'default';
  @Prop() showDropDown: boolean = true;

  @Event() changeSigner: EventEmitter<number>;

  render() {
    return (
      <Host>
        <div
          class={`valid-label ${this.validationErrors.length === 0 ? 'valid' : 'invalid'} ${this.type === 'compose' ? 'compose' : 'default'}`}
          onClick={this.validationErrors.length && (() => (this.isExpanded = !this.isExpanded))}
        >
          {this.validationErrors.length > 0 && <div class={`field-counter ${this.type === 'compose' ? 'compose' : 'default'}`}>{this.validationErrors.length}</div>}
          {this.type === 'compose' ? (this.validationErrors.length === 0 ? 'Ready' : `Required`) : this.validationErrors.length === 0 ? 'Ready to Send' : `Requires Fields`}
          {this.validationErrors.length > 0 && this.showDropDown && this.type !== 'compose' && (
            <ls-icon name={this.isExpanded ? 'chevron-up' : 'chevron-down'} style={{ cursor: 'pointer', scale: '0.60', margin: '0 -0.25rem' }} />
          )}
          {this.validationErrors.length > 0 && this.type === 'compose' && <ls-icon name="cursor-click" solid size="16" customStyle={{ color: 'var(--red-70, #DC2721);' }} />}
        </div>
        {this.isExpanded && this.validationErrors.length !== 0 && this.showDropDown && this.type !== 'compose' && (
          <div class={'field-dropdown'}>
            <div class={'dropdown-header'}>
              <h2>Fields Required</h2>
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
        {this.isExpanded && this.validationErrors.length !== 0 && this.showDropDown && this.type === 'compose' && (
          <div class={'field-dropdown compose'}>
            <div class="validation-tag-header">
              <p class="validation-tag-title">Recipients Missing Signature</p>
            </div>
            {this.validationErrors.map((field, idx) => {
              const signerIndex = field?.role?.signerIndex ? field?.role?.signerIndex % 100 : null;
              const pallette = defaultRolePalette[signerIndex || field?.element?.signer || 0];
              return (
                <div
                  class="validation-tag-row"
                  key={idx}
                  onClick={() => {
                    this.changeSigner.emit(field?.role?.signerIndex);
                    this.isExpanded = false;
                  }}
                >
                  <div class="validation-tag-bar" style={{ background: pallette.s60 }}></div>
                  <div class="validation-tag-details">
                    <p class="validation-tag-name">{`${field?.role?.firstname} ${field?.role?.lastname}`}</p>
                    <p class="validation-tag-email">{field?.role?.email}</p>
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
