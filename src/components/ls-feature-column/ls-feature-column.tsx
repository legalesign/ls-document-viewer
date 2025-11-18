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
  @Prop({ mutable: true }) manager: 'document' | 'toolbox' | 'participant'| 'recipient' | 'validation' = 'toolbox';


  /**
   * The mode that document viewer is being used in.
   * {'preview' | 'editor' | 'custom'}
   */
  @Prop() mode: 'preview' | 'editor' | 'compose' = 'editor';

  // Send an manager change up the DOM
  @Event() manage: EventEmitter<'document' | 'toolbox' | 'participant' | 'recipient' | 'validation'>;

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
  }

  render() {
    return (
      <Host>
        <div
          class={this.mode !== "editor" ? 'hidden' : this.manager === 'document' ? 'activeIcon' : 'defaultIcon'}
          onClick={() => {
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
          class={this.mode !== "editor" ? 'hidden' : this.manager === 'participant' ? 'activeIcon' : 'defaultIcon'}
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

        <div
          class={this.mode !== "compose" ? 'hidden' : this.manager === 'recipient' ? 'activeIcon' : 'defaultIcon'}
          onClick={() => {
            this.manage.emit('recipient');
            this.manager = 'recipient';
          }}
          data-tooltip-title="Recipients"
          data-tooltip="View the list of Recipients for this document"
          data-tooltip-placement="right"
        >
          <ls-icon name="user-group" size="24" />
        </div>

        <div
          class={this.mode !== "compose" ? 'hidden' : this.manager === 'validation' ? 'activeIcon' : 'defaultIcon'}
          onClick={() => {
            this.manage.emit('validation');
            this.manager = 'validation';
          }}
          data-tooltip-title="Validation"
          data-tooltip="View the list of Recipients for this document"
          data-tooltip-placement="right"
        >
          <ls-icon name="adjustments" size="24" />
        </div>

        <slot></slot>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
