import { Component, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { LSApiRole } from '../../types/LSApiRole';
import { LSApiElement, LSMutateEvent } from '../../components';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

@Component({
  tag: 'ls-participant-select',
  styleUrl: 'ls-participant-select.css',
  shadow: true,
})
export class LsParticipantSelect {
  @Prop({
    mutable: true,
  })
  dataItem: LSApiElement[];

  /**
   * The currently selected role.
   * {number}
   */
  @State() selectedRole: { signerIndex: number; name: string } = { signerIndex: 0, name: 'Sender' };

  /**
   * The current template roles.
   * {LSApiRole}
   */
  @Prop() roles?: LSApiRole[] = [];

  @State() isOpen: boolean = false;

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
  // @Element() component: HTMLElement;

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  toggleDropdown = () => {
    this.isOpen = !this.isOpen;
  };

  @Event() roleChanged: EventEmitter<number>;

  selectRole(role: { signerIndex: number; name: string }) {
    this.selectedRole = role;
    this.isOpen = false;
    this.roleChanged.emit(role.signerIndex);

    console.log('Selected role:', this.selectedRole);
  }

  render() {
    return (
      <Host>
        {/* <select onChange={(input) => {
          this.alter({ signer: parseInt((input.target as HTMLSelectElement).value) })
        }}>
          <option value="0">Sender</option>
          {this.roles.map(r => <option value={r.signerIndex}>{r.name}</option>)}

        </select> */}
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
                background: `var(--${
                  this.selectedRole?.signerIndex > 100 ? defaultRolePalette[this.selectedRole?.signerIndex - 100] : defaultRolePalette[this.selectedRole?.signerIndex || 0]
                }-20)`,
                color: `var(--${
                  this.selectedRole?.signerIndex > 100 ? defaultRolePalette[this.selectedRole?.signerIndex - 100] : defaultRolePalette[this.selectedRole?.signerIndex || 0]
                }-90)`,
              }}
            >
              <ls-icon name={this.selectedRole?.signerIndex > 100 ? 'eye' : 'signature'} />
              {this.selectedRole.name}
            </div>
            <button class={'tertiaryGrey'} aria-haspopup="listbox" aria-expanded={this.isOpen} style={{ margin: '-0.125rem' }}>
              <ls-icon name={this.isOpen ? 'chevron-up' : 'chevron-down'}></ls-icon>
            </button>
          </div>
          {this.isOpen && (
            <div class="dropdown-list">
              <div
                class={this.selectedRole?.signerIndex === 0 ? 'dropdown-item selected' : 'dropdown-item'}
                onClick={() => this.selectRole({ signerIndex: 0, name: 'Sender' })}
                onMouseEnter={e => (e.currentTarget as HTMLElement).querySelector('.check-icon')?.setAttribute('name', 'check-circle')}
                onMouseLeave={e =>
                  (e.currentTarget as HTMLElement).querySelector('.check-icon')?.setAttribute('name', this.selectedRole?.signerIndex !== 0 ? 'base-circle' : 'check-circle')
                }
              >
                <div
                  class={'role-icon'}
                  style={{
                    background: `var(--${defaultRolePalette[0]}-40)`,
                    color: `var(--${defaultRolePalette[0]}-80)`,
                  }}
                >
                  <ls-icon name="user" />
                </div>
                <div class={'role-text'}>
                  <p class={'role-name'}>{'Sender'}</p>
                  <p class={'role-type'}>You</p>
                </div>

                <ls-icon class={'check-icon'} name={this.selectedRole?.signerIndex === 0 ? 'check-circle' : 'base-circle'} solid={this.selectedRole?.signerIndex === 0} />
              </div>
              {this.roles.map(r => (
                <div
                  class={r.signerIndex === this.selectedRole?.signerIndex ? 'dropdown-item selected' : 'dropdown-item'}
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
                      background: r.signerIndex > 100 ? `var(--${defaultRolePalette[r.signerIndex - 100]}-30)` : `var(--${defaultRolePalette[r.signerIndex]}-40)`,
                      color: `var(--${defaultRolePalette[r.signerIndex]}-90)`,
                    }}
                  >
                    <ls-icon name={r.signerIndex > 100 ? 'eye' : 'signature'} />
                  </div>
                  <div class={'role-text'}>
                    <p class={'role-name'}>{r.name}</p>
                    <p class={'role-type'}>Signer {r.signerIndex}</p>
                  </div>
                  <ls-icon
                    class={'check-icon'}
                    name={r.signerIndex === this.selectedRole?.signerIndex ? 'check-circle' : 'base-circle'}
                    solid={r.signerIndex === this.selectedRole?.signerIndex}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <slot></slot>
      </Host>
    );
  }
}
