import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LSApiElement, LSMutateEvent } from '../../components';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-field-size',
  styleUrl: 'ls-field-size.scss',
  shadow: true,
})
export class LsFieldSize {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement[];

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  mutate: EventEmitter<LSMutateEvent[]>;

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
  }

  render() {
    return (
      <Host>
        <div class={'ls-dv-field-properties-section'}>
          <div class={'ls-dv-field-properties-section-text'}>
            <p class={'ls-dv-field-properties-section-title'}>Scale and Resize</p>
            <p class={'ls-dv-field-properties-section-description'}>Multi-select fields and match their dimensions</p>
          </div>
          <div class={'ls-dv-button-group'}>
            <button
              onClick={() => this.alter({ width: this.dataItem[0].width, height: this.dataItem[0].height })}
              aria-label={dvI18n.t('alignment.matchsize')}
              data-tooltip={dvI18n.t('alignment.matchsize')}
            >
              <ls-icon name="field-scale"></ls-icon>
            </button>
            <button
              aria-label={dvI18n.t('alignment.matchwidth')}
              onClick={() => this.alter({ width: this.dataItem[0].width })}
              data-tooltip={dvI18n.t('alignment.matchwidth')}
            >
              <ls-icon name="field-match-width"></ls-icon>
            </button>
            <button
              onClick={() => this.alter({ height: this.dataItem[0].height })}
              aria-label={dvI18n.t('alignment.matchheight')}
              data-tooltip={dvI18n.t('alignment.matchheight')}
            >
              <ls-icon name="field-match-height"></ls-icon>
            </button>
          </div>
        </div>

        <slot></slot>
        <ls-tooltip id="ls-tooltip-master"></ls-tooltip>
      </Host>
    );
  }
}
