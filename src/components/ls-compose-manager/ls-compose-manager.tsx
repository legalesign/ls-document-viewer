import { Component, Host, h, Prop } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';


@Component({
  tag: 'ls-compose-manager',
  styleUrl: 'ls-compose-manager.scss',
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
          <div class="ls-dv-editor-infobox">
          <h2 class="ls-dv-toolbox-section-title">Recipient Fields</h2>
          <p class="ls-dv-toolbox-section-description">Select and Click to place Signature fields where on the Document.</p>
        </div>
        <div class="ls-dv-participant-list">
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
