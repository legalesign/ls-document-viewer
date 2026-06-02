import { Component, Host, Prop, h, Event, EventEmitter, Watch, Element, State } from '@stencil/core';
import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { attachAllTooltips } from '../../utils/tooltip';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-participant-card',
  styleUrl: 'ls-participant-card.scss',
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

    const formatRoleName = (signer: LSApiRole) => {
      if (signer.roleType == 'WITNESS') return dvI18n.t('participants.participantwitness', { index: signer.signerIndex % 100 });
      return dvI18n.t('participants.participant', { index: signer.signerIndex });
    };

    return (
      <Host>
        <div
          class={'ls-dv-participant-card' + (child ? ' ls-dv-top-card' : this.signer?.signerParent ? ' ls-dv-bottom-card' : ' ls-dv-full-card')}
          style={{
            background: defaultRolePalette[this.signer?.signerIndex % 100].s10,
            border: `1px solid ${defaultRolePalette[this.signer?.signerIndex % 100].s60}`,
            marginTop: this.signer.roleType === 'WITNESS' ? '-0.813rem' : '0',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).querySelector('.ls-dv-button-set')?.classList.remove('ls-dv-hidden')}
          onMouseLeave={e => (e.currentTarget as HTMLElement).querySelector('.ls-dv-button-set')?.classList.add('ls-dv-hidden')}
          onDblClick={() => {
            this.editable = true;
          }}
        >
          <div class={'ls-dv-participant-card-inner'}>
            <div class={'ls-dv-participant-card-top-items'}>
              <div
                class={'ls-dv-role-label'}
                style={{
                  background: defaultRolePalette[this.signer?.signerIndex % 100].s20,
                  color: defaultRolePalette[this.signer?.signerIndex % 100].s90,
                }}
              >
                <ls-icon name={this.signer?.roleType === 'APPROVER' ? 'check-circle' : this.signer?.roleType === 'SIGNER' ? 'signature' : 'eye'} />
                {this.signer?.ordinal || ''}
              </div>
              <div class={'ls-dv-button-set ls-dv-hidden'}>
                {this.index > 0 && this.signer.roleType !== 'WITNESS' && (
                  <div
                    class="ls-dv-inner-button"
                    onClick={() => {
                      this.swapHandler(this.signer, this.template.roles[this.index - 1]);
                    }}
                    style={{
                      '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                      '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                    }}
                    data-tooltip={dvI18n.t('participants.moveup')}
                  >
                    <ls-icon name="arrow-up" size="1.125rem" />
                  </div>
                )}
                {this.signer.signerIndex !== this.template.roles.length && this.signer.roleType !== 'WITNESS' && (
                  <div
                    class="ls-dv-inner-button"
                    onClick={() => {
                      this.swapHandler(this.signer, this.template.roles[this.index + 1]);
                    }}
                    style={{
                      '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                      '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                    }}
                    data-tooltip={dvI18n.t('participants.movedown')}
                  >
                    <ls-icon name="arrow-down" size="1.125rem" />
                  </div>
                )}
                <div
                  class="ls-dv-inner-button"
                  onClick={() => {
                    this.editable = !this.editable;
                  }}
                  style={{
                    '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                    '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                  }}
                >
                  <ls-icon name={this.editable ? 'check' : 'pencil-alt'} size="1.125rem" data-tooltip={this.editable ? dvI18n.t('participants.savechanges') : dvI18n.t('participants.editparticipant')} />
                </div>
                <div
                  class="ls-dv-inner-button"
                  onClick={() => {
                    this.deleteHandler(this.signer);
                  }}
                  style={{
                    '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                    '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                  }}
                  data-tooltip={dvI18n.t('participants.deleteparticipant')}
                  data-tooltip-placement="top-end"
                >
                  <ls-icon name="trash" size="1.125rem" />
                </div>
              </div>
            </div>
            {this.editable ? (
              <div class={'ls-dv-participant-card-inner'}>
                {this.signer?.roleType !== 'WITNESS' ? (
                  <ls-input-wrapper select leadingIcon={this.signer?.roleType === 'APPROVER' ? 'check-circle' : 'signature'}>
                    <select
                      name="roleType"
                      id="role-type"
                      class={'ls-dv-has-leading-icon'}
                      onChange={e => this.alter({ roleType: (e.target as HTMLSelectElement).value })}
                      disabled={child ? true : false}
                    >
                      <option value="APPROVER" selected={this.signer?.roleType === 'APPROVER'}>
                        {dvI18n.t('participants.approver')}
                      </option>
                      <option value="SIGNER" selected={this.signer?.roleType === 'SIGNER'}>
                        {dvI18n.t('participants.signer')}
                      </option>
                    </select>
                  </ls-input-wrapper>
                ) : (
                  <ls-input-wrapper leadingIcon="eye">
                    <input name="roleType" id="role-type" class={'ls-dv-has-leading-icon'} disabled value="Witness" />
                  </ls-input-wrapper>
                )}
                <input
                  type="text"
                  id="participant-description"
                  name="participantDescription"
                  placeholder={dvI18n.t('participants.placeholder')}
                  defaultValue={this.signer.name}
                  onInput={e => this.alter({ name: (e.target as HTMLInputElement).value })}
                  onKeyUp={e => {
                    if (e.key === 'Enter' || e.keyCode === 13) this.editable = false;
                  }}
                />
                {this.signer?.roleType === 'SIGNER' && !child ? (
                  <button class={'ls-dv-tertiary'} onClick={() => this.addParticipant.emit({ type: 'WITNESS', parent: this.signer.id })}>
                    <ls-icon name="plus" style={{ marginRight: '0.25rem' }} />
                    {dvI18n.t('participants.addwitness')}
                  </button>
                ) : this.signer?.roleType === 'SIGNER' && child ? (
                  <button
                    class={'ls-dv-destructive'}
                    onClick={() => {
                      this.deleteHandler(child);
                    }}
                  >
                    <ls-icon name="minus-sm" style={{ marginRight: '0.25rem' }} />
                    {dvI18n.t('participants.removewitness')}
                  </button>
                ) : this.signer?.roleType === 'WITNESS' ? (
                  <button
                    class={'ls-dv-destructive'}
                    onClick={() => {
                      this.deleteHandler(this.signer);
                    }}
                  >
                    <ls-icon name="minus-sm" style={{ marginRight: '0.25rem' }} />
                    {dvI18n.t('participants.removewitness')}
                  </button>
                ) : null}
              </div>
            ) : (
              <div class={'ls-dv-participant-card-text'}>
                <p
                  class="ls-dv-participant-text-description"
                  style={{
                    color: defaultRolePalette[this.signer?.signerIndex % 100].s100,
                  }}
                >
                  {this.signer.name || formatRoleName(this.signer)}
                </p>
                <p
                  class="ls-dv-participant-text-type"
                  style={{
                    color: defaultRolePalette[this.signer?.signerIndex % 100].s80,
                    textTransform: 'capitalize',
                  }}
                >
                  {dvI18n.t(`participants.${this.signer.roleType.toLowerCase()}`)}
                </p>
                {this.signer?.roleType !== 'APPROVER' && (
                  <div
                    class={'ls-dv-role-label ls-dv-fields'}
                    style={{
                      background: participantFields.length === 0 ? defaultRolePalette[this.signer?.signerIndex % 100].s60 : defaultRolePalette[this.signer?.signerIndex % 100].s20,
                      color: participantFields.length === 0 ? 'white' : defaultRolePalette[this.signer?.signerIndex % 100].s90,
                    }}
                  >
                    {participantFields.length === 0 && <ls-icon name="exclamation-circle" size="1rem" style={{ marginRight: '0.125rem' }} />}
                    {participantFields.length === 0 ? dvI18n.t('participants.signaturerequired') : `${participantFields.length} ${participantFields.length === 1 ? dvI18n.t('common.field') : dvI18n.t('common.fields')}`}
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
