import { Component, Host, h, Prop, Event, EventEmitter, State, Listen, Element, Watch } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { LSApiRecipient } from '../../types/LSApiRecipient';
import { LSApiTemplate } from '../../components';
import { ValidationError } from '../../types/ValidationError';
import { IToolboxField } from '../interfaces/IToolboxField';
import { dvI18n } from '../../i18n/i18n';
import { FIELD_DEFAULTS } from '../../constants/fieldDefaults';

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
    formElementType: 'signature',
    elementType: 'signature',
    validation: 0,
    defaultHeight: FIELD_DEFAULTS['signature'].defaultHeight,
    defaultWidth: FIELD_DEFAULTS['signature'].defaultWidth,
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
    const recipientSignatures = recipientFields.filter(f => f.elementType === 'signature' || f.elementType === 'auto sign');
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
                style={{ display: (!this.isHovered || this.recipient.signerIndex === this.activeRecipient) && this.validationErrors.filter(v => v?.signerIndex === this.recipient.signerIndex && v?.title === 'Missing signature').length > 0 ? 'block' : 'none' }}
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
              {this.recipient.signerIndex > 0 && this.showTool('signature') && this.recipient?.roleType !== 'APPROVER' && (
                <ls-toolbox-field
                  elementType="signature"
                  formElementType="signature"
                  label={dvI18n.t('toolbox.signature')}
                  defaultHeight={FIELD_DEFAULTS['signature'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['signature'].defaultWidth}
                  validation={0}
                  icon="signature-icon"
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
                  defaultHeight={FIELD_DEFAULTS['auto sign'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['auto sign'].defaultWidth}
                  validation={3000}
                  icon="auto-sign-icon"
                  tooltip={dvI18n.t('toolbox.autosigntooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.showTool('text') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="text"
                  label={dvI18n.t('toolbox.text')}
                  defaultHeight={FIELD_DEFAULTS['text'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['text'].defaultWidth}
                  validation={0}
                  icon="text-icon"
                  tooltip={dvI18n.t('toolbox.texttooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.recipient.signerIndex > 0 && this.showTool('signing date') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="signing date"
                  label={dvI18n.t('toolbox.signingdate')}
                  defaultHeight={FIELD_DEFAULTS['signing date'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['signing date'].defaultWidth}
                  validation={32}
                  icon="auto-date-icon"
                  tooltip={dvI18n.t('toolbox.signingdatetooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('date') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="date"
                  label={dvI18n.t('toolbox.date')}
                  defaultHeight={FIELD_DEFAULTS['date'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['date'].defaultWidth}
                  validation={4}
                  icon="calender-icon"
                  tooltip={dvI18n.t('toolbox.datetooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.showTool('email') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="email"
                  label={dvI18n.t('toolbox.email')}
                  defaultHeight={FIELD_DEFAULTS['email'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['email'].defaultWidth}
                  validation={1}
                  icon="at-symbol-icon"
                  tooltip={dvI18n.t('toolbox.emailtooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('initials') && (
                <ls-toolbox-field
                  elementType="initials"
                  formElementType="initials"
                  label={dvI18n.t('toolbox.initials')}
                  defaultHeight={FIELD_DEFAULTS['initials'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['initials'].defaultWidth}
                  validation={2000}
                  icon="initials-icon"
                  tooltip={dvI18n.t('toolbox.initialstooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('number') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="number"
                  label={dvI18n.t('toolbox.number')}
                  defaultHeight={FIELD_DEFAULTS['number'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['number'].defaultWidth}
                  validation={50}
                  icon="hashtag-icon"
                  tooltip={dvI18n.t('toolbox.numbertooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('dropdown') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="dropdown"
                  label={dvI18n.t('toolbox.dropdown')}
                  defaultHeight={FIELD_DEFAULTS['dropdown'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['dropdown'].defaultWidth}
                  validation={20}
                  icon="dropdown-icon"
                  tooltip={dvI18n.t('toolbox.dropdowntooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('checkbox') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="checkbox"
                  label={dvI18n.t('toolbox.checkbox')}
                  defaultHeight={FIELD_DEFAULTS['checkbox'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['checkbox'].defaultWidth}
                  validation={25}
                  icon="check-icon"
                  tooltip={dvI18n.t('toolbox.checkboxtooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.recipient.signerIndex > 0 && this.showTool('regex') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="regular expression"
                  label={dvI18n.t('toolbox.regex')}
                  defaultHeight={FIELD_DEFAULTS['regular expression'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['regular expression'].defaultWidth}
                  validation={93}
                  icon="code-icon"
                  tooltip={dvI18n.t('toolbox.regextooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.recipient.signerIndex > 0 && this.showTool('file') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="file"
                  label={dvI18n.t('toolbox.file')}
                  defaultHeight={FIELD_DEFAULTS['file'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['file'].defaultWidth}
                  validation={74}
                  icon="upload-icon"
                  tooltip={dvI18n.t('toolbox.filetooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.recipient.signerIndex > 0 && this.showTool('drawn') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="drawn field"
                  label={dvI18n.t('toolbox.drawn')}
                  defaultHeight={FIELD_DEFAULTS['drawn field'].defaultHeight}
                  defaultWidth={FIELD_DEFAULTS['drawn field'].defaultWidth}
                  validation={90}
                  icon="pencil-icon"
                  tooltip={dvI18n.t('toolbox.drawntooltip')}
                  signer={this.recipient.signerIndex}
                />
              )}
            </div>
          </div>
        </div>
        <slot></slot>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
