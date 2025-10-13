import { Component, Host, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';
import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { LSMutateEvent } from '../../types/LSMutateEvent';

@Component({
  tag: 'ls-participant-manager',
  styleUrl: 'ls-participant-manager.css',
  shadow: true,
})
export class LsParticipantManager {
  @Element() element: HTMLElement;
  /**
   * The base editor.
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

  @Event({
    bubbles: true,
    composed: true,
  }) addParticipant: EventEmitter<{type: LSApiRoleType, parent?: string | null}>;


  selectedHandler(_role) {
    //console.log(role, 'participant manager')
  }

  deleteHandler(role: LSApiRole) {
    this.update.emit([{ action: 'delete', data: role }]);
    this.mutate.emit([{ action: 'delete', data: role }]);
  }

  swapHandler(role1, role2) {
    this.update.emit([{ action: 'swap', data: role1, data2: role2 }]);
  }

  handleOpened(event) {
    const participants = this.element.shadowRoot.querySelectorAll('ls-participant-card');

    participants.forEach(element => {
      if (element.signer.id !== event.detail.id) element.editable = false;
    });
  }

  render() {
    return (
      <Host>
        <div class="ls-editor-infobox">
          <h2 class="toolbox-section-title">Participants</h2>
          <p class="toolbox-section-description">Select and Click to place Signature fields where you’d like on the Document.</p>
        </div>
        <div class="participant-list">
          {this.template &&
            this.template?.roles.map((r, index) => {
              return <ls-participant-card signer={r} index={index} template={this.template} onOpened={(event) => {
                this.handleOpened.bind(this)(event)
              }} />;
            })}
        </div>
        <div class={'add-participant-button'}>
          <button onClick={() => this.addParticipant.emit({type: 'SIGNER'})}>
            <ls-icon name="user-add" size="20" color="var(--gray-100, #45484D);" />
            <p>Add Participant</p>
          </button>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
