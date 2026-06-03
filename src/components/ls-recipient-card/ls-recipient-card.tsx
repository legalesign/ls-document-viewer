import { Component, Host, h, Prop, Event, EventEmitter, State, Listen, Element, Watch } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { LSApiRecipient } from '../../types/LSApiRecipient';
import { LSApiTemplate } from '../../components';
import { ValidationError } from '../../types/ValidationError';
import { IToolboxField } from '../interfaces/IToolboxField';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-recipient-card',
  styleUrl: 'ls-recipient-card.scss',
  shadow: true,
})
export class LsRecipientCard {
  @Element() component: HTMLElement;
  /**
   * The initial template data, including the link for background PDF. See README and
   * example for correct GraphQL query and data structure.
   * {LSApiTemplate}
   */
  @Prop() recipient: LSApiRecipient;
  @Prop() activeRecipient: number;
  @Prop() fieldTypeSelected: IToolboxField = {
    label: 'Signature',
    formElementType: 'signature-icon',
    elementType: 'signature-icon',
    validation: 0,
    defaultHeight: 27,
    defaultWidth: 120,
  };
  @Prop() template: LSApiTemplate;
  @State() isHovered: boolean = false;

  private setIsHovered(value: boolean) {
    this.isHovered = value;
  }
  @Prop() validationErrors: ValidationError[] = [];

  /**
   * Allows the selection of fields in the toolbox to be limited to a | (pipe) delimited list.
   * {string}
   */
  @Prop() filtertoolbox?: string = null;

  // Send an internal event to be processed
  @Event() changeSigner: EventEmitter<number>;

  // Send an internal event to be processed
  @Event() fieldSelected: EventEmitter<IToolboxField>;

  @Listen('fieldTypeSelected')
  handleFieldTypeSelected(event) {
    const fields = this.component.shadowRoot.querySelectorAll('ls-toolbox-field');

    console.log(fields);

    fields.forEach(element => {
      element.isSelected = element.formElementType === event.detail.formElementType;
    });

    this.fieldTypeSelected = event.detail;
  }

  showTool(fieldFormType: string): boolean {
    return this.filtertoolbox === null || this.filtertoolbox.split('|').includes(fieldFormType);
  }

  private cardRef!: HTMLElement;

  @Watch('activeRecipient')
  handleExpandCollapse() {
    if (!this.cardRef) return;

    const isActive = this.activeRecipient === this.recipient.signerIndex;

    if (isActive) {
      // Expand
      this.cardRef.style.maxHeight = this.cardRef.scrollHeight + 2 + 'px';
    } else {
      // Collapse
      this.cardRef.style.maxHeight = '6rem';
    }
  }

  componentDidLoad() {
    const isActive = this.activeRecipient === this.recipient.signerIndex;
    this.cardRef.style.maxHeight = isActive ? this.cardRef.scrollHeight + 2 + 'px' : '6rem';
  }

  render() {
    const recipientFields = this.template.elementConnection.templateElements.filter(f => f.signer === this.recipient.signerIndex) || [];
    const recipientSignatures = recipientFields.filter(f => f.elementType === 'signature-icon' || f.elementType === 'auto sign');
    return (
      <Host>
        <div
          ref={el => (this.cardRef = el)}
          class={`ls-dv-participant-card ls-dv-top-card ls-dv-full-card ${this.activeRecipient === this.recipient.signerIndex ? 'ls-dv-expanded' : ''}`}
          style={{
            background: defaultRolePalette[this.recipient?.signerIndex % 100].s10,
            border: `1px ${this.recipient.roleType === 'WITNESS' ? 'dashed' : 'solid'} ${defaultRolePalette[this.recipient?.signerIndex % 100].s60}`,
            outline: `${this.recipient.signerIndex === this.activeRecipient ? '4px solid ' + defaultRolePalette[this.recipient?.signerIndex % 100].s40 : 'none'}`,
            marginTop: '0',
            cursor: 'pointer',
          }}
          onClick={() => {
            this.changeSigner.emit(this.recipient.signerIndex);
          }}
          onMouseEnter={() => {
            this.setIsHovered(true);
          }}
          onMouseLeave={() => {
            this.setIsHovered(false);
          }}
        >
          <div class={'ls-dv-participant-card-inner'}>
            <div class={'ls-dv-participant-card-top-items'}>
              <div
                class={'ls-dv-role-label'}
                style={{
                  background: defaultRolePalette[this.recipient?.signerIndex % 100].s20,
                  color: defaultRolePalette[this.recipient?.signerIndex % 100].s90,
                }}
              >
                <ls-icon name={this.recipient?.roleType === 'APPROVER' ? 'check-circle-icon' : this.recipient?.roleType === 'WITNESS' ? 'eye-icon' : 'signature-icon'} size={16} />
                {dvI18n.t(`participants.${(this.recipient?.roleType || 'SIGNER').toLowerCase()}`)}
              </div>
              <ls-icon
                name="cursor-click-icon"
                size={16}
                customStyle={{ color: defaultRolePalette[this.recipient?.signerIndex % 100].s70 }}
                solid
                style={{ display: this.isHovered && this.recipient.signerIndex !== this.activeRecipient ? 'block' : 'none' }}
              />
              <div
                class="ls-dv-dot"
                style={{ display: (!this.isHovered || this.recipient.signerIndex === this.activeRecipient) && this.validationErrors.filter(v => v?.signerIndex === this.recipient.signerIndex).length > 0 ? 'block' : 'none' }}
              />
            </div>

            <div class={'ls-dv-participant-card-text'}>
              <p
                class="ls-dv-participant-text-description"
                style={{
                  color: defaultRolePalette[this.recipient?.signerIndex % 100].s100,
                }}
              >
                {this.recipient?.previousRecipientDecides ? dvI18n.t('common.tobedecided') : this.recipient?.firstName + ' ' + this.recipient?.lastName}
              </p>
              <p
                class="ls-dv-participant-text-type"
                style={{
                  color: defaultRolePalette[this.recipient?.signerIndex % 100].s80,
                }}
              >
                {this.recipient?.previousRecipientDecides ? dvI18n.t('common.previousrecipientdecidesdetails') : this.recipient.email}
              </p>
              {/* {this.recipient?.roleType !== 'APPROVER' && (
                <div
                  class={'ls-dv-role-label ls-dv-fields'}
                  style={{
                    background:
                      recipientFields.length === 0 ? defaultRolePalette[this.recipient?.signerIndex % 100].s60 : defaultRolePalette[this.recipient?.signerIndex % 100].s20,
                    color: recipientFields.length === 0 ? 'white' : defaultRolePalette[this.recipient?.signerIndex % 100].s90,
                    // display: this.isHovered && this.recipient.signerIndex !== this.activeRecipient ? '' : 'none',
                  }}
                >
                  {recipientSignatures.length === 0 && <ls-icon name="exclamation-circle-icon" size={16} style={{ marginRight: '0.125rem' }} />}
                  {recipientSignatures.length === 0 ? 'Signature Required' : `${recipientFields.length} ${recipientFields.length === 1 ? 'Field' : 'Fields'}`}
                </div>
              )} */}
            </div>

            <div class="ls-dv-fields-box" style={{ display: this.recipient.signerIndex === this.activeRecipient ? 'flex' : 'hidden' }}>
              {this.recipient.signerIndex > 0 && this.showTool('signature-icon') && this.recipient?.roleType !== 'APPROVER' && (
                <ls-toolbox-field
                  elementType="signature"
                  formElementType="signature"
                  label={dvI18n.t('toolbox.signature')}
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={0}
                  icon="signature"
                  tooltip={dvI18n.t('toolbox.signaturetooltip')}
                  signer={this.recipient.signerIndex}
                  redDot={recipientSignatures.length === 0}
                />
              )}

              {this.recipient.signerIndex === 0 && this.showTool('auto sign') && (
                <ls-toolbox-field
                  elementType="admin"
                  formElementType="auto sign"
                  label={dvI18n.t('toolbox.autosign')}
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={3000}
                  icon="auto-sign"
                  tooltip={dvI18n.t('toolbox.autosigntooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.showTool('text') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="text"
                  label={dvI18n.t('toolbox.text')}
                  defaultHeight={27}
                  defaultWidth={100}
                  validation={0}
                  icon="text"
                  tooltip={dvI18n.t('toolbox.texttooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.recipient.signerIndex > 0 && this.showTool('signing date') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="signing date"
                  label={dvI18n.t('toolbox.signingdate')}
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={32}
                  icon="auto-date"
                  tooltip={dvI18n.t('toolbox.signingdatetooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('date') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="date"
                  label={dvI18n.t('toolbox.date')}
                  defaultHeight={27}
                  defaultWidth={80}
                  validation={4}
                  icon="calender"
                  tooltip={dvI18n.t('toolbox.datetooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.showTool('email') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="email"
                  label={dvI18n.t('toolbox.email')}
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={1}
                  icon="at-symbol"
                  tooltip={dvI18n.t('toolbox.emailtooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('initials') && (
                <ls-toolbox-field
                  elementType="initials"
                  formElementType="initials"
                  label={dvI18n.t('toolbox.initials')}
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={2000}
                  icon="initials"
                  tooltip={dvI18n.t('toolbox.initialstooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('number') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="number"
                  label={dvI18n.t('toolbox.number')}
                  defaultHeight={27}
                  defaultWidth={80}
                  validation={50}
                  icon="hashtag"
                  tooltip={dvI18n.t('toolbox.numbertooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('dropdown') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="dropdown"
                  label={dvI18n.t('toolbox.dropdown')}
                  defaultHeight={27}
                  defaultWidth={80}
                  validation={20}
                  icon="dropdown"
                  tooltip={dvI18n.t('toolbox.dropdowntooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('checkbox') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="checkbox"
                  label={dvI18n.t('toolbox.checkbox')}
                  defaultHeight={27}
                  defaultWidth={27}
                  validation={25}
                  icon="check"
                  tooltip={dvI18n.t('toolbox.checkboxtooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.recipient.signerIndex > 0 && this.showTool('regex') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="regex"
                  label={dvI18n.t('toolbox.regex')}
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={93}
                  icon="code"
                  tooltip={dvI18n.t('toolbox.regextooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.recipient.signerIndex > 0 && this.showTool('image') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="image"
                  label={dvI18n.t('toolbox.image')}
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={90}
                  icon="photograph"
                  tooltip={dvI18n.t('toolbox.imagetooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.recipient.signerIndex > 0 && this.showTool('file') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="file"
                  label={dvI18n.t('toolbox.file')}
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={74}
                  icon="upload"
                  tooltip={dvI18n.t('toolbox.filetooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.recipient.signerIndex > 0 && this.showTool('drawn') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="drawn"
                  label={dvI18n.t('toolbox.drawn')}
                  defaultHeight={120}
                  defaultWidth={120}
                  validation={90}
                  icon="pencil"
                  tooltip={dvI18n.t('toolbox.drawntooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
            </div>
          </div>
        </div>
        <slot></slot>
        <ls-dv-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
