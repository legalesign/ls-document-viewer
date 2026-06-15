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
  /** Hide Sender option (e.g. for signing date fields) */
  @Prop() hideSender: boolean = false;
  /** Hide approver roles (e.g. for signature-type fields) */
  @Prop() hideApprovers: boolean = false;
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
      case 'SENDER': return 'user-icon';
      case 'APPROVER': return 'check-circle-icon';
      case 'WITNESS': return 'eye-icon';
      case 'MIXED': return 'user-icon';
      default: return 'signature-icon';
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

  private getFilteredRoles(): LSApiRole[] {
    if (!this.roles) return [];
    if (this.hideApprovers) {
      return this.roles.filter(r => r.roleType !== 'APPROVER');
    }
    return this.roles;
  }

  render() {
    const selected = this.getSelectedRole();

    return (
      <Host>
        <div class="ls-dv-assignee-dropdown">
          <div
            class={`ls-dv-assignee-header ${this.disabled ? 'ls-dv-disabled' : ''}`}
          >
            <ls-icon class="ls-dv-leading-icon" name={this.getRoleIcon(selected.roleType) as any} size={18} />
            <span class="ls-dv-assignee-name">{selected.name}</span>
            {!this.disabled && (
              <button
                class="ls-dv-reassign-btn"
                onClick={e => { e.stopPropagation(); this.toggleDropdown(); }}
              >
                <ls-icon name="user-switch-icon" size={16} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('fieldproperties.reassign')} />
              </button>
            )}
          </div>
          {this.isOpen && (
            <div class="ls-dv-assignee-list">
              {!this.hideSender && (
                <div
                  class={this.signer === 0 && !this.mixed ? 'ls-dv-assignee-item ls-dv-selected' : 'ls-dv-assignee-item'}
                  style={{
                    '--background-selected': defaultRolePalette[0].s10,
                  }}
                  onClick={() => this.selectRole(0)}
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
                  <ls-icon class="ls-dv-check-icon" name={this.signer === 0 && !this.mixed ? 'check-circle-icon' : 'base-circle-icon'} solid={this.signer === 0 && !this.mixed} />
                </div>
              )}
              {this.getFilteredRoles().map(r => (
                <div
                  class={r.signerIndex === this.signer && !this.mixed ? 'ls-dv-assignee-item ls-dv-selected' : 'ls-dv-assignee-item'}
                  style={{
                    '--background-selected': defaultRolePalette[r.signerIndex % 100].s10,
                  }}
                  onClick={() => this.selectRole(r.signerIndex)}
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
                      {r.name || (r.signerIndex > 100 ? dvI18n.t('participants.participantwitness', { index: r.signerIndex - 100 }) : dvI18n.t('participants.participant', { index: r.signerIndex }))}
                    </p>
                    <p class="ls-dv-role-type">
                      {r.roleType === 'WITNESS' ? dvI18n.t('participants.witness') : r.roleType === 'APPROVER' ? dvI18n.t('participants.approver') : dvI18n.t('participants.signer')}
                    </p>
                  </div>
                  <ls-icon class="ls-dv-check-icon" name={r.signerIndex === this.signer && !this.mixed ? 'check-circle-icon' : 'base-circle-icon'} solid={r.signerIndex === this.signer && !this.mixed} />
                </div>
              ))}
            </div>
          )}
        </div>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
