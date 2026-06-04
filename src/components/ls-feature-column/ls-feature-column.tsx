import { Component, Host, Prop, h, EventEmitter, Event, Element } from '@stencil/core';
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
          data-tooltip-id="ls-dv-tooltip"
          data-tooltip-html={`<strong>${dvI18n.t('featurecolumn.templatedetails')}</strong><br/>${dvI18n.t('featurecolumn.templatedetailstooltip')}`}
          data-tooltip-place="right"
        >
          <ls-icon name="document-icon" size={24} />
        </div>
        <div
          class={this.manager === 'toolbox' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('toolbox');
            this.manager = 'toolbox';
          }}
          data-tooltip-id="ls-dv-tooltip"
          data-tooltip-html={`<strong>${dvI18n.t('featurecolumn.fieldtypes')}</strong><br/>${dvI18n.t('featurecolumn.fieldtypestooltip')}`}
          data-tooltip-place="right"
        >
          <ls-icon name="typing-input-icon" size={24} />
        </div>
        
        <div
          class={this.mode !== "editor" ? 'ls-dv-hidden' : this.manager === 'participant' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('participant');
            this.manager = 'participant';
          }}
          data-tooltip-id="ls-dv-tooltip"
          data-tooltip-html={`<strong>${dvI18n.t('featurecolumn.participants')}</strong><br/>${dvI18n.t('featurecolumn.participantstooltip')}`}
          data-tooltip-place="right"
        >
          <ls-icon name="user-group-icon" size={24} />
        </div>

        <div
          class={this.mode !== "compose" ? 'ls-dv-hidden' : this.manager === 'recipient' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('recipient');
            this.manager = 'recipient';
          }}
          data-tooltip-id="ls-dv-tooltip"
          data-tooltip-html={`<strong>${dvI18n.t('featurecolumn.recipients')}</strong><br/>${dvI18n.t('featurecolumn.recipientstooltip')}`}
          data-tooltip-place="right"
        >
          <ls-icon name="user-group-icon" size={24} />
        </div>

        <div
          class={this.mode !== "preview" ? 'ls-dv-hidden' : this.manager === 'validation' ? 'ls-dv-active-icon' : 'ls-dv-default-icon'}
          onClick={() => {
            this.manage.emit('validation');
            this.manager = 'validation';
          }}
          data-tooltip-id="ls-dv-tooltip"
          data-tooltip-html={`<strong>${dvI18n.t('featurecolumn.validation')}</strong><br/>${dvI18n.t('featurecolumn.validationtooltip')}`}
          data-tooltip-place="right"
        >
          <ls-icon name="adjustments-icon" size={24} />
        </div>

        <slot></slot>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
