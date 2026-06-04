import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { ValidationError } from '../../types/ValidationError';
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

  private handleClickOutside = (event: MouseEvent) => {
    const dropdowns = this.el.shadowRoot.querySelectorAll('.ls-dv-field-dropdown');
    let clickedInside = false;
    dropdowns.forEach(dropdown => {
      if (dropdown.contains(event.target as Node)) {
        clickedInside = true;
      }
    });
    if (!clickedInside && this.isExpanded) {
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
        <div
          class={`ls-dv-valid-label ${this.validationErrors.length === 0 ? 'ls-dv-valid' : 'ls-dv-invalid'} ${this.type === 'compose' ? 'ls-dv-compose' : 'ls-dv-default'}`}
          onClick={this.validationErrors.length && (() => (this.isExpanded = !this.isExpanded))}
        >
          {this.validationErrors.length > 0 && <div class={`ls-dv-field-counter ${this.type === 'compose' ? 'ls-dv-compose' : 'ls-dv-default'}`}>{this.validationErrors.length}</div>}
          {this.type === 'compose' ? (this.validationErrors.length === 0 ? dvI18n.t('common.ready') : dvI18n.t('common.required')) : this.validationErrors.length === 0 ? dvI18n.t('common.readytosend') : dvI18n.t('common.requiresfields')}
          {this.validationErrors.length > 0 && this.showDropDown && this.type !== 'compose' && (
            <ls-icon name={this.isExpanded ? 'chevron-up-icon' : 'chevron-down-icon'} style={{ cursor: 'pointer', scale: '0.60', margin: '0 -0.25rem' }} />
          )}
          {this.validationErrors.length > 0 && this.type === 'compose' && <ls-icon name="cursor-click-icon" solid size={16} customStyle={{ color: 'var(--red-70, #DC2721);' }} />}
          {this.validationErrors.length === 0 && this.type === 'compose' && <ls-icon name="check-icon" solid size={16} customStyle={{ marginRight: '-0.125rem' }} />}
        </div>
        {this.isExpanded && this.validationErrors.length !== 0 && this.showDropDown && this.type !== 'compose' && (
          <div class={'ls-dv-field-dropdown'}>
            <div class={'ls-dv-dropdown-header'}>
              <h2>{dvI18n.t('common.fieldsrequired')}</h2>
              <p>
                {this.validationErrors.length} {this.validationErrors.length === 1 ? dvI18n.t('validation.recipientneedsignature') : dvI18n.t('validation.recipientsneedsignatures')}
              </p>
            </div>
            {this.validationErrors.map((field, idx) => {
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
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (field?.role) {
                      // For missing signature validation errors, default to signature field type
                      const fieldType = field?.element?.formElementType || 'signature';
                      this.selectFieldForPlacement.emit({
                        signerIndex: field.role.signerIndex,
                        fieldType: fieldType,
                      });
                      this.isExpanded = false;
                    } else {
                      console.log('Missing role data');
                    }
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
        )}
        {this.isExpanded && this.validationErrors.length !== 0 && this.showDropDown && this.type === 'compose' && (
          <div class={'ls-dv-field-dropdown ls-dv-compose'}>
            <div class="ls-dv-validation-tag-header">
              <p class="ls-dv-validation-tag-title">{dvI18n.t('common.recipientsmissingsignature')}</p>
            </div>
            {this.validationErrors.map((field, idx) => {
              const signerIndex = field?.role?.signerIndex ? field?.role?.signerIndex % 100 : null;
              const pallette = defaultRolePalette[signerIndex || field?.element?.signer || 0];
              return (
                <div
                  class="ls-dv-validation-tag-row"
                  key={idx}
                  onClick={() => {
                    this.changeSigner.emit(field?.role?.signerIndex);
                    this.isExpanded = false;
                  }}
                >
                  <div class="ls-dv-validation-tag-bar" style={{ background: pallette.s60 }}></div>
                  <div class="ls-dv-validation-tag-details">
                    <p class="ls-dv-validation-tag-name">{field?.role?.previousRecipientDecides ? `Recipient ${field?.role?.signerIndex + 1}` : `${field?.role?.firstName} ${field?.role?.lastName}`}</p>
                    <p class="ls-dv-validation-tag-email">{field?.role?.previousRecipientDecides ? dvI18n.t('common.detailstobedecided') : field?.role?.email}</p>
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
