import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-participant-select',
  styleUrl: 'ls-participant-select.css',
  shadow: true,
})
export class LsParticipantSelect {
  render() {
    return (
      <Host>
        <select>
          <option value="0">Sender</option>
          <option value="1">Signer 1</option>
        </select>
        <slot></slot>
      </Host>
    );
  }
}
