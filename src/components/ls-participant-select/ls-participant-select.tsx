import { Component, Host, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

@Component({
  tag: 'ls-participant-select',
  styleUrl: 'ls-participant-select.css',
  shadow: true,
})
export class LsParticipantSelect {
  /**
 * The id of the currently selected role.
 * {string}
 */
  @Prop({ mutable: true}) selected: string;
  
  /**
   * The currently selected role.
   * {number}
   */
  @State() selectedRole: { signerIndex: number; name: string; roleType?: string; default: boolean } = { signerIndex: 0, name: 'Sender', roleType: 'SENDER', default: true };

  @Watch('roles')
  handleRoleLoad() {
    if(this.selectedRole.default) {
      if(this.roles.length > 0) {
        const initialRole = this.roles.find(r => r.signerIndex === 1);
        if(initialRole) {
          this.selectedRole = { ...initialRole, default: false };
        }
      }
    } else {
      const updatedRole = this.roles.find(r => r.signerIndex === this.selectedRole.signerIndex);
      if(updatedRole) {
        this.selectedRole = { ...updatedRole, default: false };
      }
    }
  }
  /**
   * The current template roles.
   * {LSApiRole}
   */
  @Prop() roles?: LSApiRole[] = [];

  @State() isOpen: boolean = false;


  toggleDropdown = () => {
    this.isOpen = !this.isOpen;
  };

  @Event() roleChange: EventEmitter<number>;

  @Event({
    bubbles: true,
    composed: true,
  }) addParticipant: EventEmitter<{type: LSApiRoleType, parent?: string | null}>;


  selectRole(role: { signerIndex: number; name: string; roleType?: string }) {
    this.selectedRole = { ...role, default: false };
    this.isOpen = false;
    this.roleChange.emit(role.signerIndex);
  }

  createHandler() {
    this.addParticipant.emit({type: 'SIGNER'});
  }

  render() {
    return (
      <Host>
        <div class="dropdown">
          <div class="dropdown-header" onClick={this.toggleDropdown}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0.5H6.5C8.433 0.5 10 2.067 10 4V6.5C10 8.433 8.433 10 6.5 10H4C2.067 10 0.5 8.433 0.5 6.5V4C0.5 2.067 2.067 0.5 4 0.5Z" fill="#78A3FA" stroke="#F7F8FA" />
              <path
                d="M13.5 0.5H16C17.933 0.5 19.5 2.067 19.5 4V6.5C19.5 8.433 17.933 10 16 10H13.5C11.567 10 10 8.433 10 6.5V4C10 2.067 11.567 0.5 13.5 0.5Z"
                fill="#46DBAA"
                stroke="#F7F8FA"
              />
              <path
                d="M4 10H6.5C8.433 10 10 11.567 10 13.5V16C10 17.933 8.433 19.5 6.5 19.5H4C2.067 19.5 0.5 17.933 0.5 16V13.5C0.5 11.567 2.067 10 4 10Z"
                fill="#FAD232"
                stroke="#F7F8FA"
              />
              <path
                d="M14.75 12.125V14.75M14.75 14.75V17.375M14.75 14.75H17.375M14.75 14.75L12.125 14.75"
                stroke="#939599"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class={'placing-fields-text'}>Placing Fields for</p>
            <div
              class={'selected-role-label'}
              style={{
                background: defaultRolePalette[this.selectedRole?.signerIndex % 100].s20,
                color: defaultRolePalette[this.selectedRole?.signerIndex % 100].s80,
              }}
            >
              <ls-icon
                size="18"
                name={
                  this.selectedRole?.roleType === 'SENDER'
                    ? 'user'
                    : this.selectedRole?.roleType === 'APPROVER'
                      ? 'check-circle'
                      : this.selectedRole?.roleType === 'WITNESS'
                        ? 'eye'
                        : 'signature'
                }
              />
              {this.selectedRole.name ||
                (this.selectedRole.roleType === 'WITNESS' ? `Witness` : `Participant ${this.selectedRole.signerIndex}`)}
            </div>
            <button class={'tertiaryGrey expand-button'} aria-haspopup="listbox" aria-expanded={this.isOpen}>
              <ls-icon name="chevron-down"></ls-icon>
            </button>
          </div>
          {this.isOpen && (
            <div class="dropdown-list">
              <div
                class={this.selectedRole?.signerIndex === 0 ? 'dropdown-item selected' : 'dropdown-item'}
                style={{
                  '--background-selected': defaultRolePalette[0].s10,
                  '--check-icon-selected': defaultRolePalette[0].s50,
                }}
                onClick={() => this.selectRole({ signerIndex: 0, name: 'Sender', roleType: 'SENDER' })}
                onMouseEnter={e => (e.currentTarget as HTMLElement).querySelector('.check-icon')?.setAttribute('name', 'check-circle')}
                onMouseLeave={e =>
                  (e.currentTarget as HTMLElement).querySelector('.check-icon')?.setAttribute('name', this.selectedRole?.signerIndex !== 0 ? 'base-circle' : 'check-circle')
                }
              >
                <div
                  class={'role-icon'}
                  style={{
                    background: defaultRolePalette[0].s50,
                    color: defaultRolePalette[0].s80,
                  }}
                >
                  <ls-icon name="user" />
                </div>
                <div class={'role-text'}>
                  <p
                    class={'role-name'}
                    style={{
                      '--role-name-selected': defaultRolePalette[0].s80,
                    }}
                  >
                    {'Sender'}
                  </p>
                  <p
                    class={'role-type'}
                    style={{
                      '--role-type-selected': defaultRolePalette[0].s80,
                    }}
                  >
                    You
                  </p>
                </div>

                <ls-icon class={'check-icon'} name={this.selectedRole?.signerIndex === 0 ? 'check-circle' : 'base-circle'} solid={this.selectedRole?.signerIndex === 0} />
              </div>
              {this.roles.map(r => (
                <div
                  class={r.signerIndex === this.selectedRole?.signerIndex ? 'dropdown-item selected' : 'dropdown-item'}
                  style={{
                    '--background-selected': defaultRolePalette[r?.signerIndex % 100].s10,
                    '--check-icon-selected': defaultRolePalette[r?.signerIndex % 100].s50,
                  }}
                  onClick={() => this.selectRole(r)}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).querySelector('.check-icon')?.setAttribute('name', 'check-circle')}
                  onMouseLeave={e =>
                    (e.currentTarget as HTMLElement)
                      .querySelector('.check-icon')
                      ?.setAttribute('name', r.signerIndex !== this.selectedRole?.signerIndex ? 'base-circle' : 'check-circle')
                  }
                >
                  <div
                    class={'role-icon'}
                    style={{
                      background: r.signerIndex > 100 ? defaultRolePalette[r?.signerIndex % 100].s30 : defaultRolePalette[r?.signerIndex % 100].s40,
                      color: defaultRolePalette[r?.signerIndex % 100].s90,
                    }}
                  >
                    <ls-icon name={r.roleType === 'WITNESS' ? 'eye' : r.roleType === 'APPROVER' ? 'check-circle' : 'signature'} />
                  </div>
                  <div class={'role-text'}>
                    <p
                      class={'role-name'}
                      style={{
                        '--role-name-selected': defaultRolePalette[r?.signerIndex % 100].s100,
                      }}
                    >
                      {r.name || (r.signerIndex > 100 ? `Participant ${r.signerIndex - 100} Witness` : `Participant ${r.signerIndex}`)}
                    </p>
                    <p
                      class={'role-type'}
                      style={{
                        '--role-type-selected': defaultRolePalette[r?.signerIndex % 100].s80,
                      }}
                    >
                      {r.roleType === 'WITNESS' ? 'Witness' : r.roleType === 'APPROVER' ? 'Approver' : 'Signer'}
                    </p>
                  </div>
                  <ls-icon
                    class={'check-icon'}
                    name={r.signerIndex === this.selectedRole?.signerIndex ? 'check-circle' : 'base-circle'}
                    solid={r.signerIndex === this.selectedRole?.signerIndex}
                  />
                </div>
              ))}
              <button
                onClick={() => this.createHandler()}
                class={'add-participant-row'}
                style={{
                  '--background-selected': defaultRolePalette[1].s10,
                  '--check-icon-selected': defaultRolePalette[1].s50,
                }}
              >
                <div
                  class={'add-participant-icon'}
                >
                  <ls-icon name="user-add" />
                </div>
                <div class={'role-text'}>
                  <p class={'role-name'}>Add Participant</p>
                  <p class={'role-type'}>Add a new Signer</p>
                </div>
                <ls-icon class={'plus-icon'} name="plus" />
              </button>
            </div>
          )}
        </div>
        <slot></slot>
      </Host>
    );
  }
}
