import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { LSApiRole } from '../../types/LSApiRole';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-participant-select',
  styleUrl: 'ls-participant-select.css',
  shadow: true,
})
export class LsParticipantSelect {
  @Prop({
    mutable: true
  }) dataItem: LSApiElement[];

  /**
* The currently selected role.
* {number}
*/
  @Prop() selectedRole?: number = 0;

  /**
* The current template roles.
* {LSApiRole}
*/
  @Prop() roles?: LSApiRole[] = [];

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
  // @Element() component: HTMLElement;


  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff)

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: "update", data: { ...c, ...diff } as LSApiElement }
    })

    this.dataItem = diffs.map(d => d.data as LSApiElement)
    this.mutate.emit(diffs)
    this.update.emit(diffs)
  }

  render() {
    return (
      <Host>
        <select onChange={(input) => {
          this.alter({ signer: parseInt((input.target as HTMLSelectElement).value) })
        }}>
          <option value="0">Sender</option>
          {this.roles.map(r => <option value={r.signerIndex}>{r.name}</option>)}

        </select>
        <slot></slot>
      </Host>
    );
  }
}
