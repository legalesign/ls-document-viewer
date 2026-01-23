import { Component, Host, h, Prop, Event, EventEmitter, State, Listen, Element, Watch } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { LSApiRecipient } from '../../types/LSApiRecipient';
import { LSApiTemplate } from '../../components';
import { ValidationError } from '../../types/ValidationError';
import { IToolboxField } from '../interfaces/IToolboxField';

@Component({
  tag: 'ls-recipient-card',
  styleUrl: 'ls-recipient-card.css',
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
    console.log(event);
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
      this.cardRef.style.maxHeight = this.cardRef.scrollHeight + 'px';
    } else {
      // Collapse
      this.cardRef.style.maxHeight = '6rem';
    }
  }

  componentDidLoad() {
    const isActive = this.activeRecipient === this.recipient.signerIndex;
    this.cardRef.style.maxHeight = isActive ? this.cardRef.scrollHeight + 'px' : '6rem';
  }

  render() {
    const recipientFields = this.template.elementConnection.templateElements.filter(f => f.signer === this.recipient.signerIndex) || [];
    const recipientSignatures = recipientFields.filter(f => f.elementType === 'signature' || f.elementType === 'auto sign');
    return (
      <Host>
        <div
          ref={el => (this.cardRef = el)}
          class={`participant-card top-card full-card ${this.activeRecipient === this.recipient.signerIndex ? 'expanded' : ''}`}
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
          <div class={'participant-card-inner'}>
            <div class={'participant-card-top-items'}>
              <div
                class={'role-label'}
                style={{
                  background: defaultRolePalette[this.recipient?.signerIndex % 100].s20,
                  color: defaultRolePalette[this.recipient?.signerIndex % 100].s90,
                }}
              >
                <ls-icon name={this.recipient?.roleType === 'APPROVER' ? 'check-circle' : this.recipient?.roleType === 'WITNESS' ? 'eye' : 'signature'} size='1rem' />
                {this.recipient?.roleType || 'SIGNER'}
              </div>
              <ls-icon
                name="cursor-click"
                size="1rem"
                customStyle={{ color: defaultRolePalette[this.recipient?.signerIndex % 100].s70 }}
                solid
                style={{ display: this.isHovered && this.recipient.signerIndex !== this.activeRecipient ? 'block' : 'none' }}
              />
              <div
                class="dot"
                style={{ display: (!this.isHovered || this.recipient.signerIndex === this.activeRecipient) && this.validationErrors.filter(v => v?.signerIndex === this.recipient.signerIndex).length > 0 ? 'block' : 'none' }}
              />
            </div>

            <div class={'participant-card-text'}>
              <p
                class="participant-text-description"
                style={{
                  color: defaultRolePalette[this.recipient?.signerIndex % 100].s100,
                }}
              >
                {this.recipient?.previousRecipientDecides ? 'To Be Decided' : this.recipient?.firstName + ' ' + this.recipient?.lastName}
              </p>
              <p
                class="participant-text-type"
                style={{
                  color: defaultRolePalette[this.recipient?.signerIndex % 100].s80,
                }}
              >
                {this.recipient?.previousRecipientDecides ? 'Details will be decided by previous recipient' : this.recipient.email}
              </p>
              {/* {this.recipient?.roleType !== 'APPROVER' && (
                <div
                  class={'role-label fields'}
                  style={{
                    background:
                      recipientFields.length === 0 ? defaultRolePalette[this.recipient?.signerIndex % 100].s60 : defaultRolePalette[this.recipient?.signerIndex % 100].s20,
                    color: recipientFields.length === 0 ? 'white' : defaultRolePalette[this.recipient?.signerIndex % 100].s90,
                    // display: this.isHovered && this.recipient.signerIndex !== this.activeRecipient ? '' : 'none',
                  }}
                >
                  {recipientSignatures.length === 0 && <ls-icon name="exclamation-circle" size="16" style={{ marginRight: '0.125rem' }} />}
                  {recipientSignatures.length === 0 ? 'Signature Required' : `${recipientFields.length} ${recipientFields.length === 1 ? 'Field' : 'Fields'}`}
                </div>
              )} */}
            </div>

            <div class="fields-box" style={{ display: this.recipient.signerIndex === this.activeRecipient ? 'flex' : 'hidden' }}>
              {this.recipient.signerIndex > 0 && this.showTool('signature') && (
                <ls-toolbox-field
                  elementType="signature"
                  formElementType="signature"
                  label="Signature"
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={0}
                  icon="signature"
                  tooltip="Use this field to collect Signatures from Participants"
                  signer={this.recipient.signerIndex}
                  redDot={recipientSignatures.length === 0 && this.recipient.roleType !== 'APPROVER'}
                />
              )}

              {this.recipient.signerIndex === 0 && this.showTool('auto sign') && (
                <ls-toolbox-field
                  elementType="auto sign"
                  formElementType="auto sign"
                  label="Auto Sign"
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={3000}
                  icon="auto-sign"
                  tooltip="Auto-Sign lets Senders add a Signature to the Document that will be automatically applied upon Sending"
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.showTool('text') && (
                <ls-toolbox-field
                  elementType="text"
                  formElementType="text"
                  label="Text"
                  defaultHeight={27}
                  defaultWidth={100}
                  validation={0}
                  icon="text"
                  tooltip="A field for collecting any plain text values such as: names, addresses or descriptions"
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.recipient.signerIndex > 0 && this.showTool('signing date') && (
                <ls-toolbox-field
                  elementType="signing date"
                  formElementType="signing date"
                  label="Signing Date"
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={30}
                  icon="auto-date"
                  tooltip="Automatically inserts the date upon completion by the assigned Participant"
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('date') && (
                <ls-toolbox-field
                  elementType="date"
                  formElementType="date"
                  label="Date"
                  defaultHeight={27}
                  defaultWidth={80}
                  validation={2}
                  icon="calender"
                  tooltip="A field for collecting dates with built-in date formatting options"
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.showTool('email') && (
                <ls-toolbox-field
                  elementType="email"
                  formElementType="email"
                  label="Email"
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={1}
                  icon="at-symbol"
                  tooltip="A Field to only accept entries formatted as an email address (e.g., example@example.com)"
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('initials') && (
                <ls-toolbox-field
                  elementType="initials"
                  formElementType="initials"
                  label="Initials"
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={2000}
                  icon="initials"
                  tooltip="Use this field anywhere Participants are required to Initial your document"
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('number') && (
                <ls-toolbox-field
                  elementType="number"
                  formElementType="number"
                  label="Number"
                  defaultHeight={27}
                  defaultWidth={80}
                  validation={50}
                  icon="hashtag"
                  tooltip="A Field to only accept entries in numerical format. Additional validations include character limit (1 to 12 digits), and currency format (2 decimal places)"
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('dropdown') && (
                <ls-toolbox-field
                  elementType="dropdown"
                  formElementType="dropdown"
                  label="Dropdown"
                  defaultHeight={27}
                  defaultWidth={80}
                  validation={20}
                  icon="dropdown"
                  tooltip="Use this field to create custom dropdown menus in your document, or place one of our handy presets for countries or prefixes"
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.showTool('checkbox') && (
                <ls-toolbox-field
                  elementType="checkbox"
                  formElementType="checkbox"
                  label="Checkbox"
                  defaultHeight={27}
                  defaultWidth={27}
                  validation={25}
                  icon="check"
                  tooltip="Places a checkbox on your document. Handy for T&Cs or  ✔/✗ sections"
                  signer={this.recipient.signerIndex}
                />
              )}

              {this.recipient.signerIndex > 0 && this.showTool('regex') && (
                <ls-toolbox-field
                  elementType="regex"
                  formElementType="regex"
                  label="Regex"
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={93}
                  icon="code"
                  tooltip="Need a specific validation? Use this field to enter a custom RegEx and have Participants enter exactly what you need"
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.recipient.signerIndex > 0 && this.showTool('image') && (
                <ls-toolbox-field
                  elementType="image"
                  formElementType="image"
                  label="Image"
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={90}
                  icon="photograph"
                  tooltip="Use when you need Participants to upload their own images during the signing process"
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.recipient.signerIndex > 0 && this.showTool('file') && (
                <ls-toolbox-field
                  elementType="file"
                  formElementType="file"
                  label="File"
                  defaultHeight={27}
                  defaultWidth={120}
                  validation={74}
                  icon="upload"
                  tooltip="Use when you need Participants to upload their own documents during the signing process"
                  signer={this.recipient.signerIndex}
                />
              )}
              {this.recipient.signerIndex > 0 && this.showTool('drawn') && (
                <ls-toolbox-field
                  elementType="drawn"
                  formElementType="drawn"
                  label="Drawn"
                  defaultHeight={120}
                  defaultWidth={120}
                  validation={90}
                  icon="pencil"
                  tooltip="Allow users to draw on the document using their mouse or touchscreen"
                  signer={this.recipient.signerIndex}
                />
              )}
            </div>
          </div>
        </div>
        <slot></slot>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
