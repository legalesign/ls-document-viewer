import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';
import { LSApiRole } from '../../types/LSApiRole';
import { LSMutateEvent } from '../../types/LSMutateEvent';

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
    composed: true
  }) mutate: EventEmitter<LSMutateEvent[]>;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true
  }) update: EventEmitter<LSMutateEvent[]>;

  selectedHandler(role) {
    console.log(role, 'participant manager')
  }

  deleteHandler(role: LSApiRole) {
    console.log(role, 'trash manager')
    this.update.emit([{ action: 'create', data: role }])
  }

  swapHandler(role1, role2) {
    console.log(role1, role2, 'swap manager')
  }

  render() {
    return (
      <Host>
        <h1>Participants</h1>
        {this.template?.roles.map((r, index) => {
          return <div class="card" style={{
            backgroundColor: this.editor.roleColors[index].faded,
            border: "1px solid " + this.editor.roleColors[index].primary
          }}>
            <button class="titleButton" onClick={() => { this.selectedHandler(r) }}>{r?.name || 'Signer ' + index}</button>
            <button class="innerButton" onClick={() => { this.deleteHandler(r) }}><ls-icon name="trash" size="18" /></button>
            {index !== 0 ? <button class="innerButton" onClick={() => { this.swapHandler(r, this.template.roles[index - 1]) }}><ls-icon name="arrow-up" size="18" /></button> : <></>}
            {index < this.template.roles.length - 1 ? <button class="innerButton" onClick={() => { this.swapHandler(r, this.template.roles[index + 1]) }}><ls-icon name="arrow-down" size="18" /></button> : <></>}
          </div>
        })}
        <button>Add Participant</button>
        <slot></slot>
      </Host>
    );
  }
}
