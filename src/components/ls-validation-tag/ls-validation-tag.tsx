import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { ValidationError } from '../../types/ValidationError';
import { LSApiElement } from '../../types/LSApiElement';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-validation-tag',
  styleUrl: 'ls-validation-tag.scss',
  shadow: true,
})
export class LsValidationTag {
  @Prop({ mutable: true }) status: string = 'Invalid';
  @Prop({ mutable: true }) validationErrors: ValidationError[] = [];
  @Prop({ mutable: true }) isExpanded: boolean = false;
  @Prop() type: 'compose' | 'default' = 'default';
  @Prop() showDropDown: boolean = true;

  @Event() changeSigner: EventEmitter<number>;
  @Event() selectFieldForPlacement: EventEmitter<{ signerIndex: number; fieldType: string }>;
  @Event({ bubbles: true, composed: true }) selectFields: EventEmitter<LSApiElement[]>;

  private handleClickOutside = (event: MouseEvent) => {
    const path = event.composedPath();
    if (path.includes(this.el)) return;
    if (this.isExpanded) {
      this.isExpanded = false;
    }
  };

  private el: HTMLElement;

  componentDidLoad() {
    this.el = (this as any).host || (this as any).el || (this as any).component;
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    return (
      <Host ref={el => (this.el = el as HTMLElement)}>
        {this.type === 'compose' ? (
          <div
            class={`ls-dv-valid-label ls-dv-compose ${this.validationErrors.length === 0 ? 'ls-dv-valid' : 'ls-dv-invalid'}`}
            onClick={this.validationErrors.length && (() => (this.isExpanded = !this.isExpanded))}
          >
            {this.validationErrors.length > 0 && <div class="ls-dv-field-counter ls-dv-compose">{this.validationErrors.length}</div>}
            {this.validationErrors.length === 0 ? dvI18n.t('common.ready') : dvI18n.t('common.required')}
            {this.validationErrors.length > 0 && <ls-icon name="cursor-click-icon" solid size={16} customStyle={{ color: 'var(--red-70, #DC2721);' }} />}
            {this.validationErrors.length === 0 && <ls-icon name="check-icon" solid size={16} customStyle={{ marginRight: '-0.125rem' }} />}
          </div>
        ) : (
          <div class={`ls-dv-valid-label-wrapper`} onClick={() => (this.isExpanded = !this.isExpanded)}>
            <div class={`ls-dv-valid-label-icon-only ls-dv-default ${this.validationErrors.length === 0 ? 'ls-dv-valid' : 'ls-dv-invalid'}`}>
              <ls-icon name={this.validationErrors.length > 0 ? 'clipboard-list-icon' : 'check-icon'} size={20} />
            </div>
            {this.validationErrors.length > 0 && <div class="ls-dv-field-counter ls-field-counter-floating ls-dv-default">{this.validationErrors.length}</div>}
            {this.validationErrors.length > 0 && this.showDropDown && (
              <ls-icon name={this.isExpanded ? 'chevron-up-icon' : 'chevron-down-icon'} customStyle={{ color: 'var(--gray-70, #4B5563)', marginRight: '0.25rem' }} />
            )}
          </div>
        )}
        {this.isExpanded && this.validationErrors.length !== 0 && this.showDropDown && this.type !== 'compose' && (
          <div class={'ls-dv-field-dropdown'} style={{ top: '3.5rem' }}>
            {(() => {
              const signatureErrors = this.validationErrors.filter(f => f?.role && !f?.element);
              const elementErrors = this.validationErrors.filter(f => f?.element);
              return [
                signatureErrors.length > 0 && (
                  <div class="ls-dv-validation-section">
                    <div class={'ls-dv-dropdown-header'}>
                      <h2>{dvI18n.t('common.fieldsrequired')}</h2>
                      <p>
                        {signatureErrors.length} {signatureErrors.length === 1 ? dvI18n.t('validation.recipientneedsignature') : dvI18n.t('validation.recipientsneedsignatures')}
                      </p>
                    </div>
                    {signatureErrors.map((field, idx) => {
                      const signerIndex = field?.role?.signerIndex ? field?.role?.signerIndex % 100 : null;
                      const pallette = defaultRolePalette[signerIndex || 0];
                      return (
                        <div
                          key={`sig-${idx}`}
                          class={'ls-dv-required-field'}
                          style={{
                            '--field-background': pallette.s10,
                            '--field-border-color': pallette.s10,
                            '--field-background-hover': pallette.s20,
                            '--field-text-color': pallette.s70,
                            '--field-text-color-hover': pallette.s80,
                            '--field-border-color-hover': pallette.s60,
                          }}
                          onMouseDown={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            const fieldType = field?.element?.formElementType || 'signature';
                            this.selectFieldForPlacement.emit({
                              signerIndex: field.role.signerIndex,
                              fieldType: fieldType,
                            });
                            this.isExpanded = false;
                          }}
                        >
                          <div class={'ls-dv-required-field-items-left'}>
                            <div class={'ls-dv-dot'} style={{ background: pallette.s60 }} />
                            <div class={'ls-dv-required-field-items-left'}>
                              <p style={{ color: pallette.s80 }}>{field.role?.name || `Signer ${field?.role?.signerIndex + 1}`}</p>
                              <ls-label
                                text={field.role?.roleType ? dvI18n.t(`participants.${field.role.roleType.toLowerCase()}`) : `Signer ${field.role?.signerIndex + 1}`}
                                colour={pallette.description as any}
                                type="low"
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ),
                elementErrors.length > 0 && (
                  <div class="ls-dv-validation-section">
                    <div class={'ls-dv-dropdown-header'}>
                      <h2>{dvI18n.t('validation.optionsrequired')}</h2>
                      <p>
                        {elementErrors.length} {elementErrors.length === 1 ? dvI18n.t('validation.fieldneedsoptions') : dvI18n.t('validation.fieldsneedoptions')}
                      </p>
                    </div>
                    {elementErrors.map((field, idx) => {
                      const signerIndex = field?.element?.signer ? field?.element?.signer % 100 : 0;
                      const pallette = defaultRolePalette[signerIndex];
                      return (
                        <div
                          key={`el-${idx}`}
                          class={'ls-dv-required-field'}
                          style={{
                            '--field-background': pallette.s10,
                            '--field-border-color': pallette.s10,
                            '--field-background-hover': pallette.s20,
                            '--field-text-color': pallette.s70,
                            '--field-text-color-hover': pallette.s80,
                            '--field-border-color-hover': pallette.s60,
                          }}
                          onMouseDown={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.selectFields.emit([field.element]);
                            this.isExpanded = false;
                          }}
                        >
                          <div class={'ls-dv-required-field-items-left'}>
                            <div class={'ls-dv-dot'} style={{ background: pallette.s60 }} />
                            <div class={'ls-dv-required-field-items-left'}>
                              <p style={{ color: pallette.s80 }}>{field.title}</p>
                              <ls-label text={field.description} colour={pallette.description as any} type="low" size="sm" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ),
              ];
            })()}
          </div>
        )}
        {this.isExpanded && this.validationErrors.length === 0 && this.type !== 'compose' && this.showDropDown && (
          <div class={'ls-dv-field-dropdown ls-dv-field-dropdown-success'} style={{ top: '3.5rem' }}>
            <div class="ls-dv-dropdown-success-icon-outer">
              <div class="ls-dv-dropdown-success-icon-inner">
                <ls-icon name="check-icon" solid size={28} />
              </div>
            </div>
            <div class={'ls-dv-dropdown-header'}>
              <h2>{dvI18n.t('common.templatereadytosend')}</h2>
              <p>{dvI18n.t('common.allfieldsplaced')}</p>
            </div>
          </div>
        )}
        {this.isExpanded && this.validationErrors.length !== 0 && this.showDropDown && this.type === 'compose' && (
          <div class={'ls-dv-field-dropdown ls-dv-compose'}>
            {(() => {
              const signatureErrors = this.validationErrors.filter(f => f?.role && !f?.element);
              const elementErrors = this.validationErrors.filter(f => f?.element);
              return [
                signatureErrors.length > 0 && (
                  <div class="ls-dv-validation-section">
                    <div class="ls-dv-validation-tag-header">
                      <p class="ls-dv-validation-tag-title">{dvI18n.t('common.fieldsrequired')}</p>
                    </div>
                    {signatureErrors.map((field, idx) => {
                      const signerIndex = field?.role?.signerIndex ? field?.role?.signerIndex % 100 : null;
                      const pallette = defaultRolePalette[signerIndex || 0];
                      return (
                        <div
                          class="ls-dv-validation-tag-row"
                          key={`sig-${idx}`}
                          onClick={() => {
                            this.selectFieldForPlacement.emit({
                              signerIndex: field.role.signerIndex,
                              fieldType: 'signature',
                            });
                            this.isExpanded = false;
                          }}
                        >
                          <div class="ls-dv-validation-tag-bar" style={{ background: pallette.s60 }}></div>
                          <div class="ls-dv-validation-tag-details">
                            <p class="ls-dv-validation-tag-name">
                              {field?.role?.previousRecipientDecides ? `Recipient ${field?.role?.signerIndex + 1}` : `${field?.role?.firstName} ${field?.role?.lastName}`}
                            </p>
                            <p class="ls-dv-validation-tag-email">{field?.role?.previousRecipientDecides ? dvI18n.t('common.detailstobedecided') : field?.role?.email}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ),
                elementErrors.length > 0 && (
                  <div class="ls-dv-validation-section">
                    <div class="ls-dv-validation-tag-header">
                      <p class="ls-dv-validation-tag-title">{dvI18n.t('validation.optionsrequired')}</p>
                    </div>
                    {elementErrors.map((field, idx) => {
                      const signerIndex = field?.element?.signer ? field?.element?.signer % 100 : 0;
                      const pallette = defaultRolePalette[signerIndex];
                      return (
                        <div
                          class="ls-dv-validation-tag-row"
                          key={`el-${idx}`}
                          onClick={() => {
                            this.selectFields.emit([field.element]);
                            this.isExpanded = false;
                          }}
                        >
                          <div class="ls-dv-validation-tag-bar" style={{ background: pallette.s60 }}></div>
                          <div class="ls-dv-validation-tag-details">
                            <p class="ls-dv-validation-tag-name">{field.title}</p>
                            <p class="ls-dv-validation-tag-email">{field.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ),
              ];
            })()}
          </div>
        )}
      </Host>
    );
  }
}
