import { Component, Prop, Event, EventEmitter, Element, Watch, h } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LSApiRoleType } from '../../types/LSApiRole';
import { ValidationError } from '../../types/ValidationError';
import { IToolboxField } from '../interfaces/IToolboxField';
import { dvI18n } from '../../i18n/i18n';
import { FIELD_DEFAULTS } from '../../constants/fieldDefaults';

@Component({
  tag: 'ls-left-bar',
  styleUrl: 'ls-left-bar.scss',
  shadow: true,
})
export class LsLeftBar {
  @Element() el: HTMLElement;

  @Prop() mode: 'editor' | 'compose' | 'preview' = 'editor';
  @Prop() selected: HTMLLsEditorFieldElement[] = [];
  @Prop() manager: string;
  @Prop() signer: number;
  @Prop() filtertoolbox: string = null;
  @Prop() template: LSApiTemplate;
  @Prop() recipients: any[];
  @Prop() validationErrors: ValidationError[] = [];
  @Prop() fieldTypeSelected: IToolboxField;
  @Prop() displayTable: boolean = false;
  @Prop() selectedDataItems: any[] = [];

  @Event() managerChange: EventEmitter<string>;
  @Event() clearSelected: EventEmitter<void>;

  @Watch('manager')
  managerWatchHandler(newManager: string) {
    if (newManager === 'document') {
      const dm = this.el.shadowRoot.getElementById('ls-document-options') as HTMLLsDocumentOptionsElement;
      if (dm) dm.template = this.template;
    } else if (newManager === 'participant') {
      const pm = this.el.shadowRoot.getElementById('ls-participant-manager') as HTMLLsParticipantManagerElement;
      if (pm) pm.template = this.template;
    } else if (newManager === 'validation') {
      const vm = this.el.shadowRoot.getElementById('ls-validation-manager') as HTMLLsValidationManagerElement;
      if (vm) vm.validationErrors = this.validationErrors;
    }
  }

  componentDidLoad() {
    const leftBox = this.el.shadowRoot.getElementById('ls-left-box');
    if (leftBox) {
      leftBox.addEventListener('mousedown', e => e.stopPropagation());
      leftBox.addEventListener('mouseup', e => e.stopPropagation());
      leftBox.addEventListener('mousemove', e => e.stopPropagation());
    }
  }

  @Watch('signer')
  signerChanged() {
    try {
      const recipientManager = this.el.shadowRoot.getElementById('ls-recipient-manager');
      if (recipientManager) {
        const recipientsBox = recipientManager.querySelector('.ls-dv-recipients-box');
        if (recipientsBox) {
          recipientsBox.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (e) {
      // fail silently
    }
  }

  private showTool(fieldFormType: string): boolean {
    return this.filtertoolbox === null || this.filtertoolbox.split('|').includes(fieldFormType);
  }

  private checkType(type: LSApiRoleType): boolean {
    if (this.mode === 'compose' && this.recipients) {
      return this.recipients.find(r => r.roleType === type && r.signerIndex === this.signer) !== undefined;
    } else if (this.template) {
      return this.template.roles.find(r => r.roleType === type && r.signerIndex === this.signer) !== undefined;
    }
    return false;
  }

  private renderFieldProperties() {
    if (this.displayTable || this.selected.length === 0) return null;
    return (
      <div class="ls-dv-field-properties-outer">
        <div class="ls-dv-properties-header">
          <div class="ls-dv-properties-header-icon">
            <ls-icon name="pre-filled-content" />
          </div>
          <h1 class="ls-dv-properties-header-title">{dvI18n.t('viewer.fieldproperties')}</h1>
          <button
            class="ls-dv-tertiary-grey"
            onClick={e => {
              this.clearSelected.emit();
              e.preventDefault();
            }}
            style={{ borderRadius: '0.75rem' }}
            data-tooltip={dvI18n.t('viewer.closepropertiespanel')}
          >
            <ls-icon name="x" size="1.25rem" />
          </button>
        </div>
        <ls-field-properties id="my-field-panel" dataItem={this.selectedDataItems}></ls-field-properties>
      </div>
    );
  }

  private renderToolbox() {
    return (
      <div id="ls-toolbox" class={this.manager === 'toolbox' ? 'ls-dv-toolbox' : 'ls-dv-hidden'}>
        <div class="ls-dv-editor-infobox">
          <h2 class="ls-dv-toolbox-section-title">{dvI18n.t('toolbox.title')}</h2>
          <p class="ls-dv-toolbox-section-description">{dvI18n.t('toolbox.description')}</p>
        </div>
        <div class="ls-dv-fields-box">
          {this.signer > 0 && this.showTool('signature') && !this.checkType('APPROVER') && (
            <ls-toolbox-field
              elementType="signature"
              formElementType="signature"
              label={dvI18n.t('toolbox.signature')}
              defaultHeight={FIELD_DEFAULTS['signature'].defaultHeight}
              defaultWidth={FIELD_DEFAULTS['signature'].defaultWidth}
              validation={0}
              icon="signature"
              tooltip={dvI18n.t('toolbox.signaturetooltip')}
              signer={this.signer}
            />
          )}
          {this.signer === 0 && this.showTool('auto sign') && (
            <ls-toolbox-field
              elementType="admin"
              formElementType="auto sign"
              label={dvI18n.t('toolbox.autosign')}
              defaultHeight={FIELD_DEFAULTS['auto sign'].defaultHeight}
              defaultWidth={FIELD_DEFAULTS['auto sign'].defaultWidth}
              validation={3000}
              icon="auto-sign"
              tooltip={dvI18n.t('toolbox.autosigntooltip')}
              signer={this.signer}
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
              icon="text"
              tooltip={dvI18n.t('toolbox.texttooltip')}
              signer={this.signer}
            />
          )}
          {this.signer > 0 && this.showTool('signing date') && (
            <ls-toolbox-field
              elementType="text"
              formElementType="signing date"
              label={dvI18n.t('toolbox.signingdate')}
              defaultHeight={FIELD_DEFAULTS['signing date'].defaultHeight}
              defaultWidth={FIELD_DEFAULTS['signing date'].defaultWidth}
              validation={32}
              icon="auto-date"
              tooltip={dvI18n.t('toolbox.signingdatetooltip')}
              signer={this.signer}
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
              icon="calender"
              tooltip={dvI18n.t('toolbox.datetooltip')}
              signer={this.signer}
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
              icon="at-symbol"
              tooltip={dvI18n.t('toolbox.emailtooltip')}
              signer={this.signer}
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
              icon="initials"
              tooltip={dvI18n.t('toolbox.initialstooltip')}
              signer={this.signer}
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
              icon="hashtag"
              tooltip={dvI18n.t('toolbox.numbertooltip')}
              signer={this.signer}
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
              icon="dropdown"
              tooltip={dvI18n.t('toolbox.dropdowntooltip')}
              signer={this.signer}
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
              icon="check"
              tooltip={dvI18n.t('toolbox.checkboxtooltip')}
              signer={this.signer}
            />
          )}
          {this.signer > 0 && this.showTool('regex') && (
            <ls-toolbox-field
              elementType="text"
              formElementType="regex"
              label={dvI18n.t('toolbox.regex')}
              defaultHeight={FIELD_DEFAULTS['regex'].defaultHeight}
              defaultWidth={FIELD_DEFAULTS['regex'].defaultWidth}
              validation={93}
              icon="code"
              tooltip={dvI18n.t('toolbox.regextooltip')}
              signer={this.signer}
            />
          )}
          {this.signer > 0 && this.showTool('image') && (
            <ls-toolbox-field
              elementType="text"
              formElementType="image"
              label={dvI18n.t('toolbox.image')}
              defaultHeight={FIELD_DEFAULTS['image'].defaultHeight}
              defaultWidth={FIELD_DEFAULTS['image'].defaultWidth}
              validation={90}
              icon="photograph"
              tooltip={dvI18n.t('toolbox.imagetooltip')}
              signer={this.signer}
            />
          )}
          {this.signer > 0 && this.showTool('file') && (
            <ls-toolbox-field
              elementType="text"
              formElementType="file"
              label={dvI18n.t('toolbox.file')}
              defaultHeight={FIELD_DEFAULTS['file'].defaultHeight}
              defaultWidth={FIELD_DEFAULTS['file'].defaultWidth}
              validation={74}
              icon="upload"
              tooltip={dvI18n.t('toolbox.filetooltip')}
              signer={this.signer}
            />
          )}
          {this.signer > 0 && this.showTool('drawn') && (
            <ls-toolbox-field
              elementType="text"
              formElementType="drawn"
              label={dvI18n.t('toolbox.drawn')}
              defaultHeight={FIELD_DEFAULTS['drawn'].defaultHeight}
              defaultWidth={FIELD_DEFAULTS['drawn'].defaultWidth}
              validation={90}
              icon="pencil"
              tooltip={dvI18n.t('toolbox.drawntooltip')}
              signer={this.signer}
            />
          )}
        </div>
      </div>
    );
  }

  private renderEditor() {
    return (
      <div id="ls-left-box" class="ls-dv-left-box">
        <div class={!this.selected || this.selected.length === 0 ? 'ls-dv-left-box-inner' : 'ls-dv-hidden'}>
          <ls-feature-column mode={this.mode} onManage={manager => this.managerChange.emit(manager.detail)} />
          {this.renderToolbox()}
          <ls-participant-manager id="ls-participant-manager" class={this.manager === 'participant' ? 'ls-dv-toolbox' : 'ls-dv-hidden'} />
          <ls-document-options id="ls-document-options" class={this.manager === 'document' ? 'ls-dv-toolbox' : 'ls-dv-hidden'} />
          <ls-validation-manager id="ls-validation-manager" class={this.manager === 'validation' ? 'ls-dv-toolbox' : 'ls-dv-hidden'} />
        </div>
        {this.renderFieldProperties()}
      </div>
    );
  }

  private renderCompose() {
    return (
      <div id="ls-left-box" class="ls-dv-left-box">
        <div class={!this.selected || this.selected.length === 0 ? 'ls-dv-left-box-inner' : 'ls-dv-hidden'}>
          <ls-recipient-manager id="ls-recipient-manager" class="ls-dv-compose-toolbox">
            <div class="ls-dv-scroll-gradient-top" />
            <div class="ls-dv-scroll-gradient-bottom" />
            <ls-validation-tag validationErrors={this.validationErrors} style={{ position: 'absolute', top: '1.125rem', right: '1rem' }} type="compose" />
            <div class="ls-dv-recipients-box">
              {this.recipients &&
                this.recipients.map(recipient => (
                  <ls-recipient-card
                    recipient={recipient}
                    activeRecipient={this.signer}
                    filtertoolbox={this.filtertoolbox}
                    template={this.template}
                    validationErrors={this.validationErrors}
                    fieldTypeSelected={this.fieldTypeSelected}
                    data-signer-index={recipient.signerIndex}
                  />
                ))}
            </div>
            <slot name="recipient-panel"></slot>
          </ls-recipient-manager>
        </div>
        {this.renderFieldProperties()}
      </div>
    );
  }

  render() {
    return this.mode === 'editor' ? this.renderEditor() : this.mode === 'compose' ? this.renderCompose() : null;
  }
}
