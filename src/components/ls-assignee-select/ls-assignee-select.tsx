import { Component, Element, Host, Listen, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import { LSApiRole } from '../../types/LSApiRole';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-assignee-select',
  styleUrl: 'ls-assignee-select.scss',
  shadow: true,
})
export class LsAssigneeSelect {
  @Element() el: HTMLElement;

  @Prop() signer: number;
  @Prop() roles: LSApiRole[] = [];
  @Prop() disabled: boolean = false;
  /** Tooltip reason why Sender is disabled. Empty string = enabled. */
  @Prop() disabledSenderReason: string = '';
  /** Tooltip reason why Approvers are disabled. Empty string = enabled. */
  @Prop() disabledApproverReason: string = '';
  /** Show mixed state (for multi-select when signers differ) */
  @Prop() mixed: boolean = false;

  @State() isOpen: boolean = false;

  @Event() assigneeChange: EventEmitter<number>;

  @Watch('signer')
  handleSignerChange() {
    // force re-render
  }

  @Listen('click', { target: 'window' })
  handleWindowClick(event: MouseEvent) {
    if (this.isOpen && !this.el.shadowRoot.contains(event.composedPath()[0] as Node)) {
      this.isOpen = false;
    }
  }

  private getSelectedRole(): { signerIndex: number; name: string; roleType: string } {
    if (this.mixed) {
      return { signerIndex: 0, name: dvI18n.t('fieldproperties.mixed'), roleType: 'MIXED' };
    }
    if (this.signer === 0) {
      return { signerIndex: 0, name: dvI18n.t('fieldproperties.sender'), roleType: 'SENDER' };
    }
    const role = this.roles?.find(r => r.signerIndex === this.signer);
    if (role) {
      return { signerIndex: role.signerIndex, name: role.name || dvI18n.t('participants.participant', { index: role.signerIndex }), roleType: role.roleType };
    }
    return { signerIndex: this.signer, name: dvI18n.t('participants.participant', { index: this.signer }), roleType: 'SIGNER' };
  }

  private getRoleIcon(roleType: string) {
    switch (roleType) {
      case 'SENDER':
        return 'user-icon';
      case 'APPROVER':
        return 'check-circle-icon';
      case 'WITNESS':
        return 'eye-icon';
      case 'MIXED':
        return 'user-icon';
      default:
        return 'signature-icon';
    }
  }

  private selectRole(signerIndex: number) {
    this.isOpen = false;
    this.assigneeChange.emit(signerIndex);
  }

  private toggleDropdown = () => {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  };

  render() {
    const selected = this.getSelectedRole();
    const senderDisabled = !!this.disabledSenderReason;

    return (
      <Host>
        <div class="ls-dv-assignee-dropdown">
          <div class={`ls-dv-assignee-header ${this.disabled ? 'ls-dv-disabled' : ''}`}>
            <ls-icon class="ls-dv-leading-icon" name={this.getRoleIcon(selected.roleType) as any} size={18} />
            <span class="ls-dv-assignee-name">{selected.name}</span>
            {!this.disabled && (
              <button
                class="ls-dv-reassign-btn"
                onClick={e => {
                  e.stopPropagation();
                  this.toggleDropdown();
                }}
                data-tooltip-id="ls-dv-tooltip"
                data-tooltip-content={dvI18n.t('fieldproperties.reassign')}
              >
                <ls-icon name="switch-horizontal-icon" size={16} />
              </button>
            )}
          </div>
          {this.isOpen && (
            <div class="ls-dv-assignee-list">
              <div
                class={`ls-dv-assignee-item ${this.signer === 0 && !this.mixed ? 'ls-dv-selected' : ''} ${senderDisabled ? 'ls-dv-item-disabled' : ''}`}
                style={{
                  '--background-selected': defaultRolePalette[0].s10,
                  '--role-name-selected': defaultRolePalette[0].s80,
                  '--role-type-selected': defaultRolePalette[0].s80,
                  '--check-icon-selected': defaultRolePalette[0].s50,
                }}
                onClick={() => !senderDisabled && this.selectRole(0)}
                data-tooltip-id={senderDisabled ? 'ls-dv-assignee-tooltip' : undefined}
                data-tooltip-html={
                  senderDisabled ? `<span style="white-space:normal;word-break:break-word;max-width:19rem;display:block">${this.disabledSenderReason}</span>` : undefined
                }
              >
                <div
                  class="ls-dv-role-icon"
                  style={{
                    background: defaultRolePalette[0].s50,
                    color: defaultRolePalette[0].s80,
                  }}
                >
                  <ls-icon name="user-icon" size={16} />
                </div>
                <div class="ls-dv-role-text">
                  <p class="ls-dv-role-name">{dvI18n.t('fieldproperties.sender')}</p>
                </div>
                {senderDisabled ? (
                  <ls-icon class="ls-dv-check-icon" name="exclamation-circle-icon" />
                ) : (
                  <ls-icon class="ls-dv-check-icon" name={this.signer === 0 && !this.mixed ? 'check-circle-icon' : 'base-circle-icon'} solid={this.signer === 0 && !this.mixed} />
                )}
              </div>
              {this.roles.map(r => {
                const isApproverDisabled = r.roleType === 'APPROVER' && !!this.disabledApproverReason;
                return (
                  <div
                    class={`ls-dv-assignee-item ${r.signerIndex === this.signer && !this.mixed ? 'ls-dv-selected' : ''} ${isApproverDisabled ? 'ls-dv-item-disabled' : ''}`}
                    style={{
                      '--background-selected': defaultRolePalette[r.signerIndex % 100].s10,
                      '--role-name-selected': defaultRolePalette[r.signerIndex % 100].s100,
                      '--role-type-selected': defaultRolePalette[r.signerIndex % 100].s80,
                      '--check-icon-selected': defaultRolePalette[r.signerIndex % 100].s50,
                    }}
                    onClick={() => !isApproverDisabled && this.selectRole(r.signerIndex)}
                    data-tooltip-id={isApproverDisabled ? 'ls-dv-assignee-tooltip' : undefined}
                    data-tooltip-html={
                      isApproverDisabled ? `<span style="white-space:normal;word-break:break-word;max-width:19rem;display:block">${this.disabledApproverReason}</span>` : undefined
                    }
                  >
                    <div
                      class="ls-dv-role-icon"
                      style={{
                        background: defaultRolePalette[r.signerIndex % 100].s40,
                        color: defaultRolePalette[r.signerIndex % 100].s90,
                      }}
                    >
                      <ls-icon name={this.getRoleIcon(r.roleType) as any} size={16} />
                    </div>
                    <div class="ls-dv-role-text">
                      <p class="ls-dv-role-name">
                        {r.name ||
                          (r.signerIndex > 100
                            ? dvI18n.t('participants.participantwitness', { index: r.signerIndex - 100 })
                            : dvI18n.t('participants.participant', { index: r.signerIndex }))}
                      </p>
                      <p class="ls-dv-role-type">
                        {r.roleType === 'WITNESS'
                          ? dvI18n.t('participants.witness')
                          : r.roleType === 'APPROVER'
                            ? dvI18n.t('participants.approver')
                            : dvI18n.t('participants.signer')}
                      </p>
                    </div>
                    {isApproverDisabled ? (
                      <ls-icon class="ls-dv-check-icon" name="exclamation-circle-icon" />
                    ) : (
                      <ls-icon
                        class="ls-dv-check-icon"
                        name={r.signerIndex === this.signer && !this.mixed ? 'check-circle-icon' : 'base-circle-icon'}
                        solid={r.signerIndex === this.signer && !this.mixed}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <ls-tooltip tooltipId="ls-dv-assignee-tooltip" />
      </Host>
    );
  }
}
