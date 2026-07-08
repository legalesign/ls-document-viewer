import { Component, Host, Prop, h, Event, EventEmitter, Element, State, Watch, Listen } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { LSApiRole } from '../../types/LSApiRole';
import { validationTypes, getInputType } from '../ls-document-viewer/editorUtils';
import { getFieldPlaceholder, getFieldTitleSuggestion } from '../ls-document-viewer/defaultFieldLabels';
import { dvI18n } from '../../i18n/i18n';
import { validateFieldValue } from '../../utils/fieldValueValidator';
import { getDefaultValidationForType } from '../ls-field-type-select/fieldTypeUtils';
import { forceCloseDatePicker } from '../../utils/utils';

@Component({
  tag: 'ls-field-content',
  styleUrl: 'ls-field-content.scss',
  shadow: true,
})
export class LsFieldContent {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement;
  @Prop() roles: LSApiRole[] = [];
  @Prop() showValidationTypes: boolean = true;
  @Prop() readonly: boolean = false;
  @Prop() filtertoolbox: string = null;

  @State() valueError: string | null = null;
  @State() isDirty: boolean = false;

  @Watch('dataItem')
  watchDataItemHandler() {
    this.valueError = validateFieldValue(
      this.dataItem?.formElementType,
      this.dataItem?.validation,
      this.dataItem?.value,
      this.dataItem?.options,
    );
    this.isDirty = !!this.dataItem?.value && this.dataItem.value.length > 0;
  }

  componentWillLoad() {
    if (this.dataItem?.value) {
      this.isDirty = true;
      this.valueError = validateFieldValue(
        this.dataItem?.formElementType,
        this.dataItem?.validation,
        this.dataItem?.value,
        this.dataItem?.options,
      );
    }
  }

  disconnectedCallback() {
    if (this.labeltimer) {
      clearTimeout(this.labeltimer);
      this.labeltimer = null;
      // Component is already detached from DOM so events can't bubble.
      // Dispatch on document and let ls-document-viewer pick it up.
      document.dispatchEvent(
        new CustomEvent('ls-flush-mutate', {
          detail: [{ action: 'update', data: this.dataItem }],
        }),
      );
    }
  }

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  mutate: EventEmitter<LSMutateEvent[]>;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  update: EventEmitter<LSMutateEvent[]>;

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  // Debounced alter for text inputs (value, label, options)
  alter(diff: object) {
    this.dataItem = { ...this.dataItem, ...diff };
    this.update.emit([{ action: 'update', data: this.dataItem }]);
    this.debounce(this.dataItem, 1500);
  }

  // Immediate alter for instant actions (toggles, selects, dropdowns)
  alterImmediate(diff: object) {
    this.dataItem = { ...this.dataItem, ...diff };
    this.update.emit([{ action: 'update', data: this.dataItem }]);
    if (this.labeltimer) {
      clearTimeout(this.labeltimer);
      this.labeltimer = null;
    }
    this.mutate.emit([{ action: 'update', data: this.dataItem }]);
  }

  @Listen('keydown')
  handleKeyDown(e: KeyboardEvent) {
    const isMod = e.ctrlKey || e.metaKey;
    if (isMod && (e.key === 'z' || e.key === 'Z' || e.key === 'y' || e.key === 'Y')) {
      e.preventDefault();
      // Cancel any pending debounce (discard uncommitted changes)
      if (this.labeltimer) {
        clearTimeout(this.labeltimer);
        this.labeltimer = null;
      }
      // Don't stopPropagation — let the event reach the document-level keydown handler
      return;
    }
  }

  handleValueChange(value: string) {
    this.isDirty = value.length > 0;
    this.valueError = validateFieldValue(
      this.dataItem?.formElementType,
      this.dataItem?.validation,
      value,
      this.dataItem?.options,
    );
    this.alter({ value });
  }

  private labeltimer;

  debounce(data, delay) {
    if (this.labeltimer) clearTimeout(this.labeltimer);

    this.labeltimer = setTimeout(() => {
      const diffs: LSMutateEvent[] = [{ action: 'update', data }];
      this.mutate.emit(diffs);
    }, delay);
  }

  supportsValue() {
    const typesWithValue = ['signature', 'initials', 'file', 'signing', 'autosign', 'signing date', 'auto sign', 'dropdown', 'checkbox', 'drawn field'];

    return !typesWithValue.includes(this.dataItem?.formElementType);
  }

  private getCheckboxStates(): string[] {
    const vType = validationTypes.find(v => v.id === this.dataItem?.validation);
    if (!vType) return [];
    return vType.description.split('/').reverse();
  }

  isDateField(): boolean {
    return getInputType(this.dataItem?.validation)?.inputType === 'date';
  }

  /**
   * Convert a formatted date value back to ISO (yyyy-mm-dd) for the native date input.
   */
  toISODate(value: string): string {
    if (!value) return '';
    const format = this.getDateFormat();
    if (!format) return value;

    const sep = format.match(/[/.-]/)?.[0] || '/';
    const parts = format.split(/[/.-]/);
    const valueParts = value.split(sep);
    if (valueParts.length < 2) return value;

    let y = '',
      m = '',
      d = '';
    parts.forEach((p, i) => {
      const v = valueParts[i] || '';
      if (p.startsWith('y')) y = v;
      else if (p.startsWith('m')) m = v;
      else if (p.startsWith('d')) d = v;
    });

    if (y.length === 2) y = '20' + y;
    if (!d) d = '01';

    return `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  /**
   * Convert an ISO date (yyyy-mm-dd) to the configured format.
   */
  formatDateFromISO(isoValue: string): string {
    if (!isoValue) return '';
    const [y, m, d] = isoValue.split('-');
    const format = this.getDateFormat();
    if (!format) return isoValue;

    return format
      .replace('yyyy', y)
      .replace('yy', y.slice(-2))
      .replace('mm', m)
      .replace('dd', d)
      .replace('d', String(parseInt(d)));
  }

  private getDateFormat(): string | null {
    const vType = validationTypes.find(v => v.id === this.dataItem?.validation);
    if (!vType || vType.inputType !== 'date') return null;
    return vType.description;
  }

  private getDateFormatById(validation: number): string | null {
    const vType = validationTypes.find(v => v.id === validation);
    if (!vType || vType.inputType !== 'date') return null;
    return vType.description;
  }

  private isSignatureType(): boolean {
    const fieldType = this.dataItem?.formElementType as string;
    return fieldType === 'signature' || fieldType === 'auto sign';
  }

  private getRoleType(): string {
    if (this.dataItem?.signer === 0) return 'SENDER';
    const role = this.roles?.find(r => r.signerIndex === this.dataItem?.signer);
    return role?.roleType || 'SIGNER';
  }

  private handleFieldTypeChange(newType: string) {
    const defaultValidation = getDefaultValidationForType(newType);
    const isSender = this.dataItem?.signer === 0;

    // Determine elementType based on formElementType
    let elementType: string;
    if (isSender) {
      elementType = 'admin';
    } else if (newType === 'signature') {
      elementType = 'signature';
    } else if (newType === 'initials') {
      elementType = 'initials';
    } else {
      elementType = 'text';
    }

    // Field types that don't support a user-editable value
    const noValueTypes = ['signature', 'initials', 'file', 'signing date', 'auto sign', 'date', 'dropdown', 'checkbox', 'drawn field'];
    // Also clear value when leaving a date field (formatted date values aren't valid for other types)
    const currentType = this.dataItem?.formElementType as string;
    const dateTypes = ['date', 'signing date'];
    const shouldClearValue = noValueTypes.includes(newType) || dateTypes.includes(currentType);

    const diff: any = {
      formElementType: newType as LSApiElement['formElementType'],
      elementType,
      validation: defaultValidation,
    };
    if (shouldClearValue) {
      diff.value = '';
    }

    this.dataItem = { ...this.dataItem, ...diff };
    this.mutate.emit([{ action: 'update', data: this.dataItem }]);
    this.update.emit([{ action: 'update', data: this.dataItem }]);
  }

  private getSenderDisabledReason(): string {
    const signerOnlyTypes = ['file', 'drawn', 'drawn field', 'initials'];
    const fieldType = this.dataItem?.formElementType as string;
    if (signerOnlyTypes.includes(fieldType)) {
      const nameMap = {
        'file': dvI18n.t('toolbox.file'),
        'drawn': dvI18n.t('toolbox.drawn'),
        'drawn field': dvI18n.t('toolbox.drawn'),
        'initials': dvI18n.t('toolbox.initials'),
      };
      return dvI18n.t('fieldproperties.cannotreassignsendersingle', { fieldTypes: nameMap[fieldType] || fieldType });
    }
    return '';
  }

  private handleReassign(newSigner: number) {
    const fieldType = this.dataItem?.formElementType as string;

    // Auto Sign reassigned away from Sender → becomes Signature
    if (fieldType === 'auto sign' && newSigner !== 0) {
      this.alterImmediate({ signer: newSigner, formElementType: 'signature', elementType: 'signature', validation: 0 });
      return;
    }

    // Signature reassigned to Sender → becomes Auto Sign
    if (fieldType === 'signature' && newSigner === 0) {
      this.alterImmediate({ signer: newSigner, formElementType: 'auto sign' as any, elementType: 'admin', validation: 3000 });
      return;
    }

    // Initials reassigned to Sender → becomes Text (sender can't have initials)
    if (fieldType === 'initials' && newSigner === 0) {
      this.alterImmediate({ signer: newSigner, formElementType: 'text', elementType: 'admin', validation: 0 });
      return;
    }

    // Any field reassigned to Sender → elementType becomes 'admin'
    // Any field reassigned away from Sender → elementType reverts to its formElementType category
    if (newSigner === 0) {
      this.alterImmediate({ signer: newSigner, elementType: 'admin' });
    } else if (this.dataItem?.signer === 0) {
      const elType = (fieldType === 'initials') ? 'initials' : 'text';
      this.alterImmediate({ signer: newSigner, elementType: elType });
    } else {
      this.alterImmediate({ signer: newSigner });
    }
  }

  private handleFormatChange(newValidation: number) {
    const currentValue = this.dataItem?.value;
    if (!currentValue || !this.isDateField()) {
      this.alterImmediate({ validation: newValidation });
      return;
    }

    // Parse current value to ISO using the old format
    const oldFormat = this.getDateFormat();
    const newFormat = this.getDateFormatById(newValidation);
    if (!oldFormat || !newFormat) {
      this.alterImmediate({ validation: newValidation });
      return;
    }

    const parts = oldFormat.split(/[/.-]/);
    const sep = oldFormat.match(/[/.-]/)?.[0] || '/';
    const valueParts = currentValue.split(sep);
    if (valueParts.length < 2) {
      this.alterImmediate({ validation: newValidation });
      return;
    }

    let y = '',
      m = '',
      d = '';
    parts.forEach((p, i) => {
      const v = valueParts[i] || '';
      if (p.startsWith('y')) y = v;
      else if (p.startsWith('m')) m = v;
      else if (p.startsWith('d')) d = v;
    });

    if (y.length === 2) y = '20' + y;
    if (!d) d = '01';

    const newValue = newFormat
      .replace('yyyy', y.padStart(4, '0'))
      .replace('yy', y.slice(-2))
      .replace('mm', m.padStart(2, '0'))
      .replace('dd', d.padStart(2, '0'))
      .replace('d', String(parseInt(d)));

    this.alterImmediate({ validation: newValidation, value: newValue });
  }

  render() {
    return (
      <Host>
        {this.roles?.length > 0 && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.assignee')} sectionDescription={dvI18n.t('fieldproperties.assigneedescription')}>
            <ls-assignee-select
              signer={this.dataItem?.signer}
              roles={this.roles}
              disabled={this.readonly}
              disabledSenderReason={this.getSenderDisabledReason()}
              disabledApproverReason={this.isSignatureType() ? dvI18n.t('fieldproperties.signaturecannotapproversingle') : ''}
              onAssigneeChange={ev => this.handleReassign(ev.detail)}
            />
          </ls-props-section>
        )}
        <ls-props-section sectionTitle={dvI18n.t('fieldproperties.fieldtype')} sectionDescription={dvI18n.t('fieldproperties.fieldtypedescription')}>
          <ls-field-type-select
            fieldType={this.dataItem?.formElementType}
            assignee={this.dataItem?.signer}
            roles={this.roles}
            roleTypes={[this.getRoleType()]}
            disabled={this.readonly}
            filtertoolbox={this.filtertoolbox}
            onFieldTypeChange={ev => this.handleFieldTypeChange(ev.detail)}
          />
        </ls-props-section>
        {this.dataItem?.formElementType !== 'signature' && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.requiredfield')} row={true} sectionDescription={dvI18n.t('fieldproperties.requiredfielddescription')}>
            <ls-toggle id="toggle-required" checked={!this.dataItem?.optional} onValueChange={ev => !this.readonly && this.alterImmediate({ optional: !ev.detail })} />
          </ls-props-section>
        )}
        <ls-props-section sectionTitle={dvI18n.t('fieldproperties.fieldlabel')} sectionDescription={dvI18n.t('fieldproperties.fieldlabeldescription')}>
          <ls-formfield
            as="text"
            name="field-label"
            value={this.dataItem?.label}
            placeholder={getFieldTitleSuggestion(this.dataItem?.formElementType)}
            disabled={this.readonly}
            onTextChange={e => this.alter({ label: e.detail.value })}
          />
        </ls-props-section>
        {this.supportsValue() && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.value')} sectionDescription={dvI18n.t('fieldproperties.valuedescription')}>
            {this.isDateField() ? (
              <div class="ls-dv-date-input-wrapper">
                <input
                  class="ls-dv-date-display"
                  type="text"
                  value={this.dataItem?.value}
                  placeholder={this.getDateFormat()}
                  readOnly
                  onClick={() => {
                    if (this.readonly) return;
                    const picker = this.component.shadowRoot.getElementById('ls-date-picker') as HTMLInputElement;
                    if (picker) picker.showPicker();
                  }}
                />
                {this.dataItem?.value && !this.readonly && (
                  <div class="ls-dv-date-clear" onClick={() => this.alterImmediate({ value: '' })}>
                    <ls-icon name="x-icon" size={20} />
                  </div>
                )}
                <input
                  id="ls-date-picker"
                  class="ls-dv-date-picker-hidden"
                  type="date"
                  value={this.toISODate(this.dataItem?.value)}
                  onInput={e => {
                    const input = e.target as HTMLInputElement;
                    this.alter({ value: this.formatDateFromISO(input.value) });
                    forceCloseDatePicker(input);
                  }}
                  disabled={this.readonly}
                />
              </div>
            ) : (
              <ls-formfield
                as="text"
                name="field-value"
                value={this.dataItem?.value}
                placeholder={getFieldPlaceholder(this.dataItem?.formElementType)}
                valid={!this.valueError}
                dirty={this.isDirty}
                errorText={this.valueError}
                disabled={this.readonly}
                onTextChange={e => this.handleValueChange(e.detail.value)}
              />
            )}
          </ls-props-section>
        )}
        {this.dataItem.validation === 20 && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.options')} sectionDescription={dvI18n.t('fieldproperties.optionsdescription')}>
            <textarea
              value={this.dataItem?.options}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              onInput={e => this.alter({ options: (e.target as HTMLTextAreaElement).value })}
              disabled={this.readonly}
            />
          </ls-props-section>
        )}

        {this.showValidationTypes && this.dataItem?.formElementType !== 'drawn field' && this.dataItem?.formElementType !== 'regular expression' && this.dataItem?.formElementType !== 'initials' && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.contentformat')} sectionDescription={dvI18n.t('fieldproperties.contentformatdescription')}>
            <ls-input-wrapper select>
              <select onChange={ev => !this.readonly && this.handleFormatChange(parseInt((ev.target as HTMLSelectElement).value))}>
                {validationTypes
                  .filter(type => type.formType === this.dataItem?.formElementType)
                  .map(type => (
                    <option selected={this.dataItem?.validation === type.id} value={type.id}>
                      {type.description}
                    </option>
                  ))}
              </select>
            </ls-input-wrapper>
          </ls-props-section>
        )}
        {this.dataItem?.formElementType === 'checkbox' && this.getCheckboxStates().length === 2 && (
          <ls-props-section sectionTitle={dvI18n.t('fieldproperties.displaystate')} sectionDescription={dvI18n.t('fieldproperties.displaystatedescription')}>
            <div class="ls-dv-checkbox-toggle">
              {this.getCheckboxStates().map((state, idx) => (
                <button
                  key={idx}
                  class={{ 'ls-dv-checkbox-toggle-btn': true, 'ls-dv-active': idx === 0 ? this.dataItem?.value?.toString() !== 'true' : this.dataItem?.value?.toString() === 'true' }}
                  onClick={() => !this.readonly && this.alterImmediate({ value: idx === 0 ? 'false' : 'true' })}
                  disabled={this.readonly}
                >
                  {state}
                </button>
              ))}
            </div>
          </ls-props-section>
        )}
        <slot></slot>
      </Host>
    );
  }
}
