import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';

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
  
  selectedHandler(role) {
    console.log(role, 'participant manager')
  }

  deleteHandler(role) {
    console.log(role, 'trash manager')
  }

  swapHandler(role1, role2) {
    console.log(role1, 'swap manager')
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
          <button class="titleButton" onClick={() => { this.selectedHandler(r)}}>{r?.name || 'Signer ' + index}</button>
          <button class="innerButton" onClick={() => { this.deleteHandler(r)}}><ls-icon name="trash" size="18"/></button>
          {index !== 0 ? <button class="innerButton" onClick={() => { this.swapHandler(r, this.template.roles[index - 1])}}><ls-icon name="arrow-up" size="18"/></button> : <></>}
          {index < this.template.roles.length - 1 ? <button class="innerButton" onClick={() => { this.swapHandler(r, this.template.roles[index + 1])}}><ls-icon name="arrow-down" size="18"/></button> : <></>}
          </div>
          })}
          <button>Add Participant</button>
        <slot></slot>
      </Host>
    );
  }
}
