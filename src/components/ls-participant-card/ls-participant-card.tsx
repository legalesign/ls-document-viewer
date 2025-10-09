import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { LSMutateEvent } from '../../types/LSMutateEvent';

@Component({
  tag: 'ls-participant-card',
  styleUrl: 'ls-participant-card.css',
  shadow: true,
})
export class LsParticipantCard {
  @Prop() signer: LSApiRole;
  @Prop() index: number;
  @Prop() editable: boolean = false;
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
  update: EventEmitter<LSMutateEvent[]>;

  selectedHandler(_role) {
    //console.log(role, 'participant manager')
  }

  deleteHandler(role: LSApiRole) {
    this.update.emit([{ action: 'delete', data: role }]);
    this.mutate.emit([{ action: 'delete', data: role }]);
  }

  swapHandler(role1, role2) {
    this.update.emit([{ action: 'swap', data: role1, data2: role2 }]);
    this.mutate.emit([{ action: 'swap', data: role1, data2: role2 }]);
  }

  render() {
    return (
      <Host>
        <div
          class="participant-card"
          onClick={() => {
            this.selectedHandler(this.signer);
          }}
          style={{
            background: defaultRolePalette[this.signer?.signerIndex % 100].s10,
            border: `1px solid ${defaultRolePalette[this.signer?.signerIndex % 100].s60}`,
            marginTop: this.signer.signerIndex > 100 && '-0.813rem',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).querySelector('.button-set')?.classList.remove('hidden')}
          onMouseLeave={e => (e.currentTarget as HTMLElement).querySelector('.button-set')?.classList.add('hidden')}
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
                <ls-icon name={this.signer?.signerIndex > 100 ? 'eye' : 'signature'} />
                {'Participant ' + (this.signer?.signerIndex || '')}
              </div>
              <div class={'button-set hidden'}>
                {this.index > 0 && (
                  <div
                    class="innerButton"
                    onClick={() => {
                      this.swapHandler(this.signer, this.template.roles[this.index - 1]);
                    }}
                    style={{
                      '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                      '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                    }}
                  >
                    <ls-icon name="arrow-up" size="18" />
                  </div>
                )}
                {this.signer.signerIndex !== this.template.roles.length && (
                  <div
                    class="innerButton"
                    onClick={() => {
                      this.swapHandler(this.signer, this.template.roles[this.index + 1]);
                    }}
                    style={{
                      '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                      '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                    }}
                  >
                    <ls-icon name="arrow-down" size="18" />
                  </div>
                )}
                <div
                  class="innerButton"
                  onClick={() => {
                    this.editable = true;
                  }}
                  style={{
                    '--default-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s40,
                    '--hover-button-colour': defaultRolePalette[this.signer?.signerIndex % 100].s60,
                  }}
                >
                  <ls-icon name="pencil-alt" size="18" />
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
                >
                  <ls-icon name="trash" size="18" />
                </div>
              </div>
            </div>
            {this.editable ? (
              <form
                class={'participant-card-inner'}
                onSubmit={e => {
                  e.preventDefault();
                  this.update.emit([
                    {
                      action: 'update',
                      data: {
                        ...this.signer,
                        roleType: (e.currentTarget as HTMLFormElement).roleType.value as LSApiRoleType,
                        name: (e.currentTarget as HTMLFormElement).participantDescription.value,
                      },
                    },
                  ]);
                  this.editable = false;
                }}
              >
                <ls-input-wrapper select leadingIcon={this.signer?.roleType === 'APPROVER' ? 'eye' : 'signature'}>
                  <select name="roleType" id="role-type" class={'has-leading-icon'}>
                    <option value="APPROVER" selected={this.signer?.roleType === 'APPROVER'}>
                      Approver
                    </option>
                    <option value="SIGNER" selected={this.signer?.roleType === 'SIGNER'}>
                      Signer
                    </option>
                  </select>
                </ls-input-wrapper>
                <input type="text" id="participant-description" name="participantDescription" placeholder="Description, eg. Tenant 1, Agent" defaultValue={this.signer.name} />
                <button type="submit" class="submit-btn">
                  Save
                </button>
              </form>
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
              </div>
            )}
          </div>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
