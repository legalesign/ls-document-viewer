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
    @Prop({ mutable: true}) manager: 'document' | 'toolbox' | 'participant' = 'toolbox';
  
    // Send an manager change up the DOM
    @Event() manage: EventEmitter<'document' | 'toolbox' | 'participant'>;
  
  
  render() {
    return (
      <Host>
        <ls-icon name='document' size="36" class={this.manager === 'document' ? 'activeIcon' : ''} onClick={()=> { console.log('document');this.manage.emit('document'); this.manager = 'document'}}/>
        <ls-icon name='typing-input' size="36"  class={this.manager === 'toolbox' ? 'activeIcon' : ''}  onClick={()=> { this.manage.emit('toolbox'); this.manager = 'toolbox'}}/>
        <ls-icon name='user-group' size="36"  class={this.manager === 'participant' ? 'activeIcon' : ''}  onClick={()=> { this.manage.emit('participant'); this.manager = 'participant'}}/>        

        <slot></slot>
      </Host>
    );
  }
}
