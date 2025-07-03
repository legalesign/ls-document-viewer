import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';

@Component({
  tag: 'ls-participant-manager',
  styleUrl: 'ls-participant-manager.css',
  shadow: true,
})

export class LsParticipantManager {


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
          return <div>{r?.name || 'Signer ' + index}</div>
          })}
        <slot></slot>
      </Host>
    );
  }
}
