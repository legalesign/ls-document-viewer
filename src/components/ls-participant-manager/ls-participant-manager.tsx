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
  
  @Watch('template')
  selectedHandler(newSelected, _oldSelected) {
    console.log(newSelected, 'participant manager')
  }
  
  render() {
    return (
      <Host>
        <h1>Participants</h1>
        {this.template?.roles.map((r, index) => {
          return <button class="card" style={{ 
            backgroundColor: this.editor.roleColors[index].faded,
            border: "1px solid " + this.editor.roleColors[index].primary
          }}>{r?.name || 'Signer ' + index}</button>
          })}
          <button>Add Participant</button>
        <slot></slot>
      </Host>
    );
  }
}
