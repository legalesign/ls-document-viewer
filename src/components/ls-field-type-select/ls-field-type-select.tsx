import { Component, Element, Host, Listen, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { LSApiRole } from '../../types/LSApiRole';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { getFieldIcon } from '../ls-document-viewer/defaultFieldIcons';
import { dvI18n } from '../../i18n/i18n';

const fieldTypeKeyMap: { [key: string]: string } = {
  'signature': 'toolbox.signature',
  'auto sign': 'toolbox.autosign',
  'text': 'toolbox.text',
  'signing date': 'toolbox.signingdate',
  'date': 'toolbox.date',
  'initials': 'toolbox.initials',
  'checkbox': 'toolbox.checkbox',
  'email': 'toolbox.email',
  'number': 'toolbox.number',
  'dropdown': 'toolbox.dropdown',
  'file': 'toolbox.file',
  'drawn field': 'toolbox.drawn',
  'regular expression': 'toolbox.regex',
};

/** All field types in display order */
const ALL_FIELD_TYPES = [
  'signature',
  'text',
  'signing date',
  'date',
  'email',
  'initials',
  'number',
  'dropdown',
  'checkbox',
  'file',
  'drawn field',
  'regular expression',
];

/**
 * Returns the list of valid field types given role types of the selected fields.
 * - Sender: no signature, no initials, no file
 * - Approver: no signature, no auto sign, no initials, no file
 * - Signer/Witness: all except auto sign
 */
const getValidFieldTypes = (roleTypes: string[]): string[] => {
  let excluded: Set<string> = new Set();

  for (const roleType of roleTypes) {
    switch (roleType) {
      case 'SENDER':
        excluded.add('signature');
        excluded.add('initials');
        excluded.add('file');
        excluded.add('signing date');
        excluded.add('drawn field');
        excluded.add('regular expression');
        break;
      case 'APPROVER':
        excluded.add('signature');
        excluded.add('initials');
        excluded.add('file');
        break;
      default: // SIGNER, WITNESS
        break;
    }
  }

  return ALL_FIELD_TYPES.filter(ft => !excluded.has(ft));
};

@Component({
  tag: 'ls-field-type-select',
  styleUrl: 'ls-field-type-select.scss',
  shadow: true,
})
export class LsFieldTypeSelect {
  @Element() el: HTMLElement;

  /** Current field type (e.g. 'text', 'signature') */
  @Prop() fieldType: string = 'text';
  /** Signer index for colour */
  @Prop() assignee: number = 1;
  /** Roles from the template for determining valid types */
  @Prop() roles: LSApiRole[] = [];
  /** Role types of the selected field(s) — used to filter valid types */
  @Prop() roleTypes: string[] = ['SIGNER'];
  /** Whether the select is disabled */
  @Prop() disabled: boolean = false;
  /** Show mixed state when multi-select has different field types */
  @Prop() mixed: boolean = false;

  @State() isOpen: boolean = false;

  @Event() fieldTypeChange: EventEmitter<string>;

  @Listen('click', { target: 'window' })
  handleWindowClick(event: MouseEvent) {
    if (this.isOpen && !this.el.shadowRoot.contains(event.composedPath()[0] as Node)) {
      this.isOpen = false;
    }
  }

  private toggleDropdown = () => {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  };

  private selectFieldType(type: string) {
    this.isOpen = false;
    this.fieldTypeChange.emit(type);
  }

  render() {
    const color = defaultRolePalette[this.assignee % 100];
    const validTypes = getValidFieldTypes(this.roleTypes);
    const displayLabel = this.mixed
      ? dvI18n.t('fieldproperties.mixed')
      : dvI18n.t(fieldTypeKeyMap[this.fieldType] || 'toolbox.text');

    return (
      <Host>
        <div class="ls-dv-fieldtype-dropdown">
          <div
            class="ls-dv-fieldtype-header"
            style={{
              border: `1px dashed ${color.s30}`,
              background: color.s10,
            }}
          >
            <div class="ls-dv-fieldtype-inner">
              <div
                class="ls-dv-fieldtype-icon"
                style={{
                  border: `1px solid ${color.s60}`,
                  color: color.s60,
                  background: color.s10,
                }}
              >
                <ls-icon name={this.mixed ? 'view-grid-icon' as any : getFieldIcon(this.fieldType) as any} size={20} />
              </div>
              <span class="ls-dv-fieldtype-name">{displayLabel}</span>
              {!this.disabled && (
                <button
                  class="ls-dv-fieldtype-btn"
                  onClick={e => {
                    e.stopPropagation();
                    this.toggleDropdown();
                  }}
                  data-tooltip-id="ls-dv-tooltip"
                  data-tooltip-content={dvI18n.t('fieldproperties.changefieldtype')}
                >
                  <ls-icon name="switch-horizontal-icon" size={16} />
                </button>
              )}
            </div>
          </div>
          {this.isOpen && (
            <div class="ls-dv-fieldtype-list">
              {validTypes.map(type => (
                <div
                  class={`ls-dv-fieldtype-item ${type === this.fieldType && !this.mixed ? 'ls-dv-selected' : ''}`}
                  style={{
                    '--background-selected': color.s10,
                    '--check-icon-selected': color.s50,
                  }}
                  onClick={() => this.selectFieldType(type)}
                >
                  <div
                    class="ls-dv-fieldtype-item-icon"
                    style={{
                      color: color.s60,
                    }}
                  >
                    <ls-icon name={getFieldIcon(type) as any} size={16} />
                  </div>
                  <span class="ls-dv-fieldtype-item-name">
                    {dvI18n.t(fieldTypeKeyMap[type] || 'toolbox.text')}
                  </span>
                  <ls-icon
                    class="ls-dv-check-icon"
                    name={type === this.fieldType && !this.mixed ? 'check-circle-icon' : 'base-circle-icon'}
                    solid={type === this.fieldType && !this.mixed}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
