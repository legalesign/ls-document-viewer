import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { LSApiRole } from '../../types/LSApiRole';

@Component({
  tag: 'ls-participant-select',
  styleUrl: 'ls-participant-select.css',
  shadow: true,
})
export class LsParticipantSelect {


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

  //
  // --- Event Emitters --- //
  //
  @Event() changeRole: EventEmitter<number>;

  render() {
    return (
      <Host>
        <select>
          <option value="0">Sender</option>
          {this.roles.map(r => <option value={r.id}>{r.name}</option>)}

        </select>
        <slot></slot>
      </Host>
    );
  }
}
