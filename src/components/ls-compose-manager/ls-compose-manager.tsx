import { Component, Host, h, Prop } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';


@Component({
  tag: 'ls-compose-manager',
  styleUrl: 'ls-compose-manager.css',
  shadow: true,
})
export class LsComposeManager {

  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop() template: LSApiTemplate;

  render() {
    return (
      <Host>
          <div class="ls-editor-infobox">
          <h2 class="toolbox-section-title">Recipient Fields</h2>
          <p class="toolbox-section-description">Select and Click to place Signature fields where on the Document.</p>
        </div>
        <div class="participant-list">
          {this.template &&
            this.template?.roles.map(() => {
              return (
                <div   />
              );
            })}
        </div>
        <slot></slot>
      </Host>
    );
  }
}
