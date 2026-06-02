import { Component, Host, h } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-recipient-manager',
  styleUrl: 'ls-recipient-manager.scss',
  shadow: true,
})
export class LsRecipientManager {
  render() {
    return (
      <Host>
        <div class={'ls-dv-editor-infobox'}>
          <h2 class="ls-dv-toolbox-section-title">{dvI18n.t('recipients.title')}</h2>
          <p class="ls-dv-toolbox-section-description">{dvI18n.t('recipients.description')}</p>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
