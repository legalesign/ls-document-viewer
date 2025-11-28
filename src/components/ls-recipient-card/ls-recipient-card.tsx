import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { LSApiRecipient } from '../../types/LSApiRecipient';

@Component({
  tag: 'ls-recipient-card',
  styleUrl: 'ls-recipient-card.css',
  shadow: true,
})
export class LsRecipientCard {

  /**
   * The initial template data, including the link for background PDF. See README and
   * example for correct GraphQL query and data structure.
   * {LSApiTemplate}
   */
  @Prop() recipient: LSApiRecipient;
  @Prop() activeRecipient: number;

  // Send an internal event to be processed
  @Event() changeSigner: EventEmitter<number>;

  render() {
    return (
      <Host>
        <div
          class={'participant-card top-card full-card'}
          style={{
            background: defaultRolePalette[this.recipient?.signerIndex % 100].s10,
            border: `${this.recipient.signerIndex === this.activeRecipient ? 2 : 1}px solid ${defaultRolePalette[this.recipient?.signerIndex % 100].s60}`,
            marginTop: this.recipient.roleType === 'WITNESS' ? '-0.813rem' : '0',
            cursor: 'pointer',
          }}
          onClick={() => { this.changeSigner.emit(this.recipient.signerIndex); }}
        >
          <div class={'participant-card-inner'}>
            <div class={'participant-card-top-items'}>
              <div
                class={'role-label'}
                style={{
                  background: defaultRolePalette[this.recipient?.signerIndex % 100].s20,
                  color: defaultRolePalette[this.recipient?.signerIndex % 100].s90,
                }}
              >
                <ls-icon name={this.recipient?.roleType === 'APPROVER' ? 'check-circle' : this.recipient?.roleType === 'WITNESS' ? 'eye' : 'signature'} />
                {(this.recipient?.firstname + ' ' + this.recipient?.lastname)}
              </div>
            </div>

            <div class={'participant-card-text'}>
              <p
                class="participant-text-description"
                style={{
                  color: defaultRolePalette[this.recipient?.signerIndex % 100].s100,
                }}
              >
                {this.recipient.email}
              </p>
            </div>
          </div>
        </div>
        <slot></slot>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
