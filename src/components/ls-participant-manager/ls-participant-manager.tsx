import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';
import { LSApiRole } from '../../types/LSApiRole';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';

@Component({
  tag: 'ls-participant-manager',
  styleUrl: 'ls-participant-manager.css',
  shadow: true,
})
export class LsParticipantManager {
  /**
   * The base template information (as JSON).
   * {LSDocumentViewer}
   */
  @Prop() editor: LsDocumentViewer;

  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
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
  }

  swapHandler(role1, role2) {
    this.update.emit([{ action: 'swap', data: role1, data2: role2 }]);
  }
  createHandler() {
    const data: LSMutateEvent[] = [
      {
        action: 'create',
        data: {
          id: btoa('rol' + crypto.randomUUID()),
          name: 'Signer ' + this.template.roles.length,
          roleType: 'SIGNER',
          signerIndex: this.template.roles.length,
          ordinal: this.template.roles.length,
          signerParent: null,
          experience: '',
        },
      },
    ]
    this.update.emit(data);
    this.mutate.emit(data);
  }

  participantColor = (index: number) => {
    return index > 200 ? 'gray' : index > 100 ? defaultRolePalette[index - 100] : defaultRolePalette[index] || defaultRolePalette[0];
  };

  render() {
    return (
      <Host>
        <div class="ls-editor-infobox">
          <h2 class="toolbox-section-title">Participants</h2>
          <p class="toolbox-section-description">Select and Click to place Signature fields where you’d like on the Document.</p>
        </div>
        <div class="participant-list">
          {this.template?.roles.map((r, index) => {
            return (
              <div
                class="participant-card"
                onClick={() => {
                  this.selectedHandler(r);
                }}
                style={{
                  background: `var(--${this.participantColor(r?.signerIndex)}-10)`,
                  border: '1px solid ' + `var(--${this.participantColor(r?.signerIndex)}-60)`,
                  marginTop: r.signerIndex > 100 && '-0.813rem',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).querySelector('.innerButton')?.classList.remove('hidden')}
                onMouseLeave={e => (e.currentTarget as HTMLElement).querySelector('.innerButton')?.classList.add('hidden')}
              >
                <div class={'participant-card-top-items'}>
                  {' '}
                  <div
                    class={'role-label'}
                    style={{
                      background: `var(--${this.participantColor(r?.signerIndex)}-20)`,
                      color: `var(--${this.participantColor(r?.signerIndex)}-90)`,
                    }}
                  >
                    <ls-icon name={r?.signerIndex > 100 ? 'eye' : 'signature'} />
                    {'Participant ' + (index + 1)}
                  </div>
                  <div
                    class="innerButton hidden"
                    onClick={() => {
                      this.deleteHandler(r);
                    }}
                  >
                    <ls-icon
                      name="trash"
                      size="18"
                      style={{
                        color: `var(--${this.participantColor(r?.signerIndex)}-40)`,
                      }}
                    />
                  </div>
                </div>
                <div class={'participant-card-text'}>
                  <p
                    class="participant-text-description"
                    style={{
                      color: `var(--${this.participantColor(r?.signerIndex)}-100)`,
                    }}
                  >
                    {r.name || `${r.signerIndex > 100 ? 'Witness' : 'Signer'} ${index + 1}`}
                  </p>
                  <p
                    class="participant-text-type"
                    style={{
                      color: `var(--${this.participantColor(r?.signerIndex)}-80)`,
                    }}
                  >
                    {r.signerIndex > 100 ? 'Witness' : 'Signer'}
                  </p>
                </div>

                {/* {index !== 0 ? (
                <button
                  class="innerButton"
                  onClick={() => {
                    this.swapHandler(r, this.template.roles[index - 1]);
                  }}
                >
                  <ls-icon name="arrow-up" size="18" />
                </button>
              ) : (
                <></>
              )}
              {index < this.template.roles.length - 1 ? (
                <button
                  class="innerButton"
                  onClick={() => {
                    this.swapHandler(r, this.template.roles[index + 1]);
                  }}
                >
                  <ls-icon name="arrow-down" size="18" />
                </button>
              ) : (
                <></>
              )} */}
              </div>
            );
          })}
        </div>
        <div class={'add-participant-button'}>
          <button onClick={() => this.createHandler()}>
            <ls-icon name="user-add" size="20" color="var(--gray-100, #45484D);" />
            <p>Add Participant</p>
          </button>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
