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
    this.update.emit([
      {
        action: 'create',
        data: {
          id: btoa('rol' + crypto.randomUUID()),
          name: 'Signer ' + this.template.roles.length,
          roleType: 'SIGNER',
          signerIndex: 1,
          ordinal: this.template.roles.length,
          signerParent: null,
          experience: '',
        },
      },
    ]);
  }

  participantColor = (index: number) => {
    return index > 100 ? defaultRolePalette[index - 100] : defaultRolePalette[index] || defaultRolePalette[0];
  };

  render() {
    return (
      <Host>
        <div class="ls-editor-infobox">
          <h2 class="toolbox-section-title">Participants</h2>
          <p class="toolbox-section-description">Select and Click to place Signature fields where you’d like on the Document.</p>
        </div>
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
              }}
            >
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
              <div class="titleButton">{r.name || `${r.signerIndex > 100 ? 'Witness' : 'Signer'} ${index + 1}`}</div>
              <button
                class="innerButton"
                onClick={() => {
                  this.deleteHandler(r);
                }}
              >
                <ls-icon name="trash" size="18" />
              </button>
              {index !== 0 ? (
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
              )}
            </div>
          );
        })}
        <button onClick={() => this.createHandler()}>Add Participant</button>
        <slot></slot>
      </Host>
    );
  }
}
