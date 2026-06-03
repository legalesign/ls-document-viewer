import { Component, Host, Prop, h, Event, EventEmitter, Watch, Element, State } from '@stencil/core';
import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { LSMutateEvent } from '../../types/LSMutateEvent';
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
  @Prop() active: boolean = false;

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

  @Event({
    bubbles: true,
    composed: true,
  })
  roleChange: EventEmitter<number>;

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
  addParticipant: EventEmitter<{ type: LSApiRoleType; parent?: string | null; signerIndex?: number }>;

  @Prop() busy: boolean = false;

  @State() swapUpBtn: HTMLElement;
  @State() swapDownBtn: HTMLElement;
  @State() editBtn: HTMLElement;
  @State() deleteParticipantBtn: HTMLElement;
  @State() addingWitness: boolean = false;

  @Watch('template')
  templateChanged() {
    this.addingWitness = false;
  }

  componentDidLoad() {}

  render() {
    const participantFields = this.template.elementConnection.templateElements.filter(f => f.signer === this.signer.signerIndex) || [];
    const child = this.template.roles.find(r => r.signerParent === this.signer.id);

    // Find previous and next non-witness roles for swapping
    const getPreviousNonWitness = () => {
      for (let i = this.index - 1; i >= 0; i--) {
        if (this.template.roles[i].roleType !== 'WITNESS') {
          return this.template.roles[i];
        }
      }
      return null;
    };

    const getNextNonWitness = () => {
      for (let i = this.index + 1; i < this.template.roles.length; i++) {
        if (this.template.roles[i].roleType !== 'WITNESS') {
          return this.template.roles[i];
        }
      }
      return null;
    };

    const previousRole = getPreviousNonWitness();
    const nextRole = getNextNonWitness();

    const formatRoleName = (signer: LSApiRole) => {
      if (signer.roleType == 'WITNESS') return dvI18n.t('participants.participantwitness', { index: signer.signerIndex % 100 });
      return dvI18n.t('participants.participant', { index: signer.signerIndex });
    };

    return (
      <Host>
        <div
          class={
            'ls-dv-participant-card' +
            (this.active ? ' ls-dv-participant-card-active' : '') +
            (child ? ' ls-dv-top-card' : this.signer?.signerParent ? ' ls-dv-bottom-card' : ' ls-dv-full-card')
          }
          style={{
            'background': defaultRolePalette[this.signer?.signerIndex % 100].s10,
            'border': `1px solid ${defaultRolePalette[this.signer?.signerIndex % 100].s60}`,
            'marginTop': this.signer.roleType === 'WITNESS' ? '-0.813rem' : '0',
            '--active-outline-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).querySelector('.ls-dv-button-set')?.classList.remove('ls-dv-hidden')}
          onMouseLeave={e => (e.currentTarget as HTMLElement).querySelector('.ls-dv-button-set')?.classList.add('ls-dv-hidden')}
          onClick={() => this.roleChange.emit(this.signer.signerIndex)}
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
                <ls-icon name={this.signer?.roleType === 'APPROVER' ? 'check-circle-icon' : this.signer?.roleType === 'SIGNER' ? 'signature-icon' : 'eye-icon'} />
                {this.signer?.ordinal || ''}
              </div>
              <div class={'ls-dv-button-set ls-dv-hidden'}>
                {previousRole && this.signer.roleType !== 'WITNESS' && (
                  <div
                    class="ls-dv-inner-button"
                    onClick={() => {
                      this.swapHandler(this.signer, previousRole);
                    }}
                    style={{
                      '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                      '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                    }}
                    data-tooltip-id="ls-dv-tooltip"
                    data-tooltip-content={dvI18n.t('participants.moveup')}
                  >
                    <ls-icon name="arrow-up-icon" size={18} />
                  </div>
                )}
                {nextRole && this.signer.roleType !== 'WITNESS' && (
                  <div
                    class="ls-dv-inner-button"
                    onClick={() => {
                      this.swapHandler(this.signer, nextRole);
                    }}
                    style={{
                      '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                      '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                    }}
                    data-tooltip-id="ls-dv-tooltip"
                    data-tooltip-content={dvI18n.t('participants.movedown')}
                  >
                    <ls-icon name="arrow-down-icon" size={18} />
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
                  <ls-icon
                    name={this.editable ? 'check-icon' : 'pencil-alt-icon'}
                    size={18}
                    data-tooltip-id="ls-dv-tooltip"
                    data-tooltip-content={this.editable ? dvI18n.t('participants.savechanges') : dvI18n.t('participants.editparticipant')}
                  />
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
                  data-tooltip-id="ls-dv-tooltip"
                  data-tooltip-content={dvI18n.t('participants.deleteparticipant')}
                  data-tooltip-place="top-end"
                >
                  <ls-icon name="trash-icon" size={18} />
                </div>
              </div>
            </div>
            {this.editable ? (
              <div class={'ls-dv-participant-card-inner'}>
                {this.signer?.roleType !== 'WITNESS' ? (
                  <ls-input-wrapper select leadingIcon={this.signer?.roleType === 'APPROVER' ? 'check-circle-icon' : 'signature-icon'}>
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
                  <ls-input-wrapper leadingIcon="eye-icon">
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
                  <ls-button
                    variant="tertiary"
                    outline
                    size="sm"
                    fullWidth
                    text={dvI18n.t('participants.addwitness')}
                    leadingIcon="plus-icon"
                    loading={this.busy || this.addingWitness}
                    disabled={this.busy || this.addingWitness}
                    onClick={() => {
                      if (this.busy || this.addingWitness) return;
                      this.addingWitness = true;
                      this.addParticipant.emit({ type: 'WITNESS', parent: this.signer.id, signerIndex: this.signer.signerIndex + 100 });
                    }}
                  />
                ) : this.signer?.roleType === 'SIGNER' && child ? (
                  <ls-button
                    variant="destructiveTertiary"
                    outline
                    size="sm"
                    fullWidth
                    text={dvI18n.t('participants.removewitness')}
                    leadingIcon="minus-sm-icon"
                    loading={this.busy}
                    disabled={this.busy}
                    onClick={() => {
                      if (this.busy) return;
                      this.deleteHandler(child);
                    }}
                  />
                ) : this.signer?.roleType === 'WITNESS' ? (
                  <ls-button
                    variant="destructiveTertiary"
                    outline
                    size="sm"
                    fullWidth
                    text={dvI18n.t('participants.removewitness')}
                    leadingIcon="minus-sm-icon"
                    loading={this.busy}
                    disabled={this.busy}
                    onClick={() => {
                      if (this.busy) return;
                      this.deleteHandler(this.signer);
                    }}
                  />
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
                    {participantFields.length === 0 && <ls-icon name="exclamation-circle-icon" size={16} style={{ marginRight: '0.125rem' }} />}
                    {participantFields.length === 0
                      ? dvI18n.t('participants.signaturerequired')
                      : `${participantFields.length} ${participantFields.length === 1 ? dvI18n.t('common.field') : dvI18n.t('common.fields')}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <slot></slot>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
