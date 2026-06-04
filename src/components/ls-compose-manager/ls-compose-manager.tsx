import { Component, Host, h, Prop } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
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
          <h2 class="ls-dv-toolbox-section-title">{dvI18n.t('recipients.recipientfields')}</h2>
          <p class="ls-dv-toolbox-section-description">{dvI18n.t('recipients.recipientfieldsdescription')}</p>
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
