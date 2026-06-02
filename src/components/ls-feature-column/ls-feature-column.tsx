import { Component, Host, Prop, h, EventEmitter, Event, Element } from '@stencil/core';
import { attachAllTooltips } from '../../utils/tooltip';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-feature-column',
  styleUrl: 'ls-feature-column.scss',
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
          class={this.mode !== "editor" ? 'ls-dv-hidden' : this.manager === 'document' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('document');
            this.manager = 'document';
          }}
          data-tooltip-title={dvI18n.t('featurecolumn.templatedetails')}
          data-tooltip={dvI18n.t('featurecolumn.templatedetailstooltip')}
          data-tooltip-placement="right"
        >
          <ls-icon name="document" size="1.5rem" />
        </div>
        <div
          class={this.manager === 'toolbox' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('toolbox');
            this.manager = 'toolbox';
          }}
          data-tooltip-title={dvI18n.t('featurecolumn.fieldtypes')}
          data-tooltip={dvI18n.t('featurecolumn.fieldtypestooltip')}
          data-tooltip-placement="right"
        >
          <ls-icon name="typing-input" size="1.5rem" />
        </div>
        
        <div
          class={this.mode !== "editor" ? 'ls-dv-hidden' : this.manager === 'participant' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('participant');
            this.manager = 'participant';
          }}
          data-tooltip-title={dvI18n.t('featurecolumn.participants')}
          data-tooltip={dvI18n.t('featurecolumn.participantstooltip')}
          data-tooltip-placement="right"
        >
          <ls-icon name="user-group" size="1.5rem" />
        </div>

        <div
          class={this.mode !== "compose" ? 'ls-dv-hidden' : this.manager === 'recipient' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('recipient');
            this.manager = 'recipient';
          }}
          data-tooltip-title={dvI18n.t('featurecolumn.recipients')}
          data-tooltip={dvI18n.t('featurecolumn.recipientstooltip')}
          data-tooltip-placement="right"
        >
          <ls-icon name="user-group" size="1.5rem" />
        </div>

        <div
          class={this.mode !== "preview" ? 'ls-dv-hidden' : this.manager === 'validation' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('validation');
            this.manager = 'validation';
          }}
          data-tooltip-title={dvI18n.t('featurecolumn.validation')}
          data-tooltip={dvI18n.t('featurecolumn.validationtooltip')}
          data-tooltip-placement="right"
        >
          <ls-icon name="adjustments" size="1.5rem" />
        </div>

        <slot></slot>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
