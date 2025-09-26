import { Component, Host, Prop, h, EventEmitter, Event } from '@stencil/core';

@Component({
  tag: 'ls-feature-column',
  styleUrl: 'ls-feature-column.css',
  shadow: true,
})
export class LsFeatureColoumn {
  /**
   * Determines / sets which of the far left 'managers' is active.
   * {'document' | 'toolbox' | 'participant' }
   */
  @Prop({ mutable: true }) manager: 'document' | 'toolbox' | 'participant' = 'toolbox';

  // Send an manager change up the DOM
  @Event() manage: EventEmitter<'document' | 'toolbox' | 'participant'>;

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
        >
          <ls-icon name="document" size="24" />
        </div>
        <div
          class={this.manager === 'toolbox' ? 'activeIcon' : 'defaultIcon'}
          onClick={() => {
            this.manage.emit('toolbox');
            this.manager = 'toolbox';
          }}
        >
          <ls-icon name="typing-input" size="24" />
        </div>
        <div
          class={this.manager === 'participant' ? 'activeIcon' : 'defaultIcon'}
          onClick={() => {
            this.manage.emit('participant');
            this.manager = 'participant';
          }}
        >
          <ls-icon name="user-group" size="24" />
        </div>

        <slot></slot>
      </Host>
    );
  }
}
