import { Component, Host, Prop, h, Event, EventEmitter, Watch, Element, State } from '@stencil/core';
import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-participant-card',
  styleUrl: 'ls-participant-card.css',
  shadow: true,
})
export class LsParticipantCard {
  @Element() component: HTMLElement;
  @Prop() signer: LSApiRole;
  @Prop() index: number;
  @Prop({ mutable: true }) editable: boolean = false;
  @Prop() template: LSApiTemplate;

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
  opened: EventEmitter<LSApiRole>;

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  // NOTE this alter is debounced to account for typing
  alter(diff: object) {
    this.signer = { ...this.signer, ...diff };
    this.debounce(this.signer, 500);
  }

  private labeltimer;

  debounce(data, delay) {
    if (this.labeltimer) clearTimeout(this.labeltimer);

    this.labeltimer = setTimeout(() => {
      const diffs: LSMutateEvent[] = [{ action: 'update', data }];
      this.mutate.emit(diffs);
    }, delay);
  }

  deleteHandler(role: LSApiRole) {
    this.mutate.emit([{ action: 'delete', data: role }]);
  }

  swapHandler(role1, role2) {
    this.mutate.emit([{ action: 'swap', data: role1, data2: role2 }]);
  }

  @Watch('editable')
  modeHandler(_editable) {
    // When opened fire an event to let the parent handle closing other controls
    if (_editable) {
      this.opened.emit(this.signer);
    }
  }

  @Event({
    bubbles: true,
    composed: true,
  })
  addParticipant: EventEmitter<{ type: LSApiRoleType; parent?: string | null }>;

  @State() swapUpBtn: HTMLElement;
  @State() swapDownBtn: HTMLElement;
  @State() editBtn: HTMLElement;
  @State() deleteParticipantBtn: HTMLElement;

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
  }

  render() {
    const participantFields = this.template.elementConnection.templateElements.filter(f => f.signer === this.signer.signerIndex) || [];
    const child = this.template.roles.find(r => r.signerParent === this.signer.id);

    return (
      <Host>
        <div
          class={'participant-card' + (child ? ' top-card' : this.signer?.signerParent ? ' bottom-card' : ' full-card')}
          style={{
            background: defaultRolePalette[this.signer?.signerIndex % 100].s10,
            border: `1px solid ${defaultRolePalette[this.signer?.signerIndex % 100].s60}`,
            marginTop: this.signer.roleType === 'WITNESS' ? '-0.813rem' : '0',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).querySelector('.button-set')?.classList.remove('hidden')}
          onMouseLeave={e => (e.currentTarget as HTMLElement).querySelector('.button-set')?.classList.add('hidden')}
          onDblClick={() => {
            this.editable = true;
          }}
        >
          <div class={'participant-card-inner'}>
            <div class={'participant-card-top-items'}>
              <div
                class={'role-label'}
                style={{
                  background: defaultRolePalette[this.signer?.signerIndex % 100].s20,
                  color: defaultRolePalette[this.signer?.signerIndex % 100].s90,
                }}
              >
                <ls-icon name={this.signer?.roleType === 'APPROVER' ? 'check-circle' : this.signer?.roleType === 'SIGNER' ? 'signature' : 'eye'} />
                {(this.signer?.ordinal || '')}
              </div>
              <div class={'button-set hidden'}>
                {this.index > 0 && this.signer.roleType !== 'WITNESS' && (
                  <div
                    class="innerButton"
                    onClick={() => {
                      this.swapHandler(this.signer, this.template.roles[this.index - 1]);
                    }}
                    style={{
                      '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                      '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                    }}
                    data-tooltip="Move Up"
                  >
                    <ls-icon name="arrow-up" size="1.125rem" />
                  </div>
                )}
                {this.signer.signerIndex !== this.template.roles.length && this.signer.roleType !== 'WITNESS' && (
                  <div
                    class="innerButton"
                    onClick={() => {
                      this.swapHandler(this.signer, this.template.roles[this.index + 1]);
                    }}
                    style={{
                      '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                      '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                    }}
                    data-tooltip="Move Down"
                  >
                    <ls-icon name="arrow-down" size="1.125rem" />
                  </div>
                )}
                <div
                  class="innerButton"
                  onClick={() => {
                    this.editable = !this.editable;
                  }}
                  style={{
                    '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                    '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                  }}
                >
                  <ls-icon name={this.editable ? 'check' : 'pencil-alt'} size="1.125rem" data-tooltip={this.editable ? "Save Changes" : "Edit Participant"} />
            
                </div>
                <div
                  class="innerButton"
                  onClick={() => {
                    this.deleteHandler(this.signer);
                  }}
                  style={{
                    '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                    '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                  }}
                  data-tooltip="Delete Participant"
                  data-tooltip-placement="top-end"
                >
                  <ls-icon name="trash" size="1.125rem" />
                </div>
              </div>
            </div>
            {this.editable ? (
              <div class={'participant-card-inner'}>
                {this.signer?.roleType !== 'WITNESS' ? (
                  <ls-input-wrapper select leadingIcon={this.signer?.roleType === 'APPROVER' ? 'check-circle' : 'signature'}>
                    <select
                      name="roleType"
                      id="role-type"
                      class={'has-leading-icon'}
                      onChange={e => this.alter({ roleType: (e.target as HTMLSelectElement).value })}
                      disabled={child ? true : false}
                    >
                      <option value="APPROVER" selected={this.signer?.roleType === 'APPROVER'}>
                        Approver
                      </option>
                      <option value="SIGNER" selected={this.signer?.roleType === 'SIGNER'}>
                        Signer
                      </option>
                    </select>
                  </ls-input-wrapper>
                ) : (
                  <ls-input-wrapper leadingIcon="eye">
                    <input name="roleType" id="role-type" class={'has-leading-icon'} disabled value="Witness" />
                  </ls-input-wrapper>
                )}
                <input
                  type="text"
                  id="participant-description"
                  name="participantDescription"
                  placeholder="Description, eg. Tenant 1, Agent"
                  defaultValue={this.signer.name}
                  onInput={e => this.alter({ name: (e.target as HTMLInputElement).value })}
                  onKeyUp={e => {
                    if (e.key === 'Enter' || e.keyCode === 13) this.editable = false;
                  }}
                />
                {this.signer?.roleType === 'SIGNER' && !child ? (
                  <button class={'tertiary'} onClick={() => this.addParticipant.emit({ type: 'WITNESS', parent: this.signer.id })}>
                    <ls-icon name="plus" style={{ marginRight: '0.25rem' }} />
                    Add Witness
                  </button>
                ) : this.signer?.roleType === 'SIGNER' && child ? (
                  <button
                    class={'destructive'}
                    onClick={() => {
                      this.deleteHandler(child);
                    }}
                  >
                    <ls-icon name="minus-sm" style={{ marginRight: '0.25rem' }} />
                    Remove Witness
                  </button>
                ) : this.signer?.roleType === 'WITNESS' ? (
                  <button
                    class={'destructive'}
                    onClick={() => {
                      this.deleteHandler(this.signer);
                    }}
                  >
                    <ls-icon name="minus-sm" style={{ marginRight: '0.25rem' }} />
                    Remove Witness
                  </button>
                ) : null}
              </div>
            ) : (
              <div class={'participant-card-text'}>
                <p
                  class="participant-text-description"
                  style={{
                    color: defaultRolePalette[this.signer?.signerIndex % 100].s100,
                  }}
                >
                  {this.signer.name || `${this.signer.signerIndex > 100 ? 'Witness' : 'Signer'} ${this.signer.signerIndex + 1}`}
                </p>
                <p
                  class="participant-text-type"
                  style={{
                    color: defaultRolePalette[this.signer?.signerIndex % 100].s80,
                    textTransform: 'capitalize',
                  }}
                >
                  {this.signer.roleType.toLowerCase()}
                </p>
                {this.signer?.roleType !== 'APPROVER' && (
                  <div
                    class={'role-label fields'}
                    style={{
                      background: participantFields.length === 0 ? defaultRolePalette[this.signer?.signerIndex % 100].s60 : defaultRolePalette[this.signer?.signerIndex % 100].s20,
                      color: participantFields.length === 0 ? 'white' : defaultRolePalette[this.signer?.signerIndex % 100].s90,
                    }}
                  >
                    {participantFields.length === 0 && <ls-icon name="exclamation-circle" size="1rem" style={{ marginRight: '0.125rem' }} />}
                    {participantFields.length === 0 ? 'Signature Required' : `${participantFields.length} ${participantFields.length === 1 ? 'Field' : 'Fields'}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <slot></slot>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
