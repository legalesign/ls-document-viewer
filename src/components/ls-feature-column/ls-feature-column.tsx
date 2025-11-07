import { Component, Host, Prop, h, EventEmitter, Event, Element } from '@stencil/core';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-feature-column',
  styleUrl: 'ls-feature-column.css',
  shadow: true,
})
export class LsFeatureColoumn {
  @Element() component: HTMLElement;
  /**
   * Determines / sets which of the far left 'managers' is active.
   * {'document' | 'toolbox' | 'participant' }
   */
  @Prop({ mutable: true }) manager: 'document' | 'toolbox' | 'participant' = 'toolbox';

  // Send an manager change up the DOM
  @Event() manage: EventEmitter<'document' | 'toolbox' | 'participant'>;

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
  }

  render() {
    return (
      <Host>
        <div
          class={this.manager === 'document' ? 'activeIcon' : 'defaultIcon'}
          onClick={() => {
            console.log('document');
            this.manage.emit('document');
            this.manager = 'document';
          }}
          data-tooltip-title="Template Details"
          data-tooltip="View and edit Template properties"
          data-tooltip-placement="right"
        >
          <ls-icon name="document" size="24" />
        </div>
        <div
          class={this.manager === 'toolbox' ? 'activeIcon' : 'defaultIcon'}
          onClick={() => {
            this.manage.emit('toolbox');
            this.manager = 'toolbox';
          }}
          data-tooltip-title="Field Types"
          data-tooltip="Select and place Form Field Elements"
          data-tooltip-placement="right"
        >
          <ls-icon name="typing-input" size="24" />
        </div>
        <div
          class={this.manager === 'participant' ? 'activeIcon' : 'defaultIcon'}
          onClick={() => {
            this.manage.emit('participant');
            this.manager = 'participant';
          }}
          data-tooltip-title="Participants"
          data-tooltip="Manage Signers, Witnesses and Approvers"
          data-tooltip-placement="right"
        >
          <ls-icon name="user-group" size="24" />
        </div>

        <slot></slot>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
