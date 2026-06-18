import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-alignment',
  styleUrl: 'ls-field-alignment.scss',
  shadow: true,
})
export class LsFieldAlignment {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement[];
  @Prop() readonly: boolean = false;
  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  mutate: EventEmitter<LSMutateEvent[]>;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  update: EventEmitter<LSMutateEvent[]>;

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  // Get the top-left-most control (anchor for all alignments)
  left() {
    const alignTo = Math.min(...this.dataItem.map(c => c.left));
    this.alter({ left: alignTo });
  }

  center() {
    const minLeft = Math.min(...this.dataItem.map(c => c.left));
    const maxRight = Math.max(...this.dataItem.map(c => c.left + c.width));
    const centerX = (minLeft + maxRight) / 2;

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newLeft = Math.round(centerX - c.width / 2);
      return {
        action: 'update',
        data: { ...c, left: newLeft } as LSApiElement,
      };
    });
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  right() {
    const alignTo = Math.max(...this.dataItem.map(c => c.left + c.width));

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newLeft = alignTo - c.width;
      return {
        action: 'update',
        data: { ...c, left: newLeft } as LSApiElement,
      };
    });
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  top() {
    const alignTo = Math.min(...this.dataItem.map(c => c.top));
    this.alter({ top: alignTo });
  }

  middle() {
    const minTop = Math.min(...this.dataItem.map(c => c.top));
    const maxBottom = Math.max(...this.dataItem.map(c => c.top + c.height));
    const centerY = (minTop + maxBottom) / 2;

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newTop = Math.round(centerY - c.height / 2);
      return {
        action: 'update',
        data: { ...c, top: newTop } as LSApiElement,
      };
    });
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  bottom() {
    const alignTo = Math.max(...this.dataItem.map(c => c.top + c.height));

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newTop = alignTo - c.height;
      return {
        action: 'update',
        data: { ...c, top: newTop } as LSApiElement,
      };
    });
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  componentDidLoad() {
  }

  render() {
    return (
      <Host>
        <div class={'ls-dv-field-properties-section'}>
          <div class={'ls-dv-field-properties-section-text'}>
            <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.alignment')}</p>
            <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.alignmentdescription')}</p>
          </div>
          <div class={'ls-dv-multi-button-group-row'}>
            <div class={'ls-dv-button-group'}>
              <button onClick={() => this.left()} aria-label={dvI18n.t('alignment.alignleft')} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.alignleft')} disabled={this.readonly}>
                <ls-icon name="field-alignment-left-icon"></ls-icon>
              </button>
              <button onClick={() => this.center()} aria-label={dvI18n.t('alignment.aligncenter')} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.aligncenter')} disabled={this.readonly}>
                <ls-icon name="field-alignment-centre-icon"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.right();
                }}
                aria-label={dvI18n.t('alignment.alignright')}
                data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.alignright')}
                disabled={this.readonly}
              >
                <ls-icon name="field-alignment-right-icon"></ls-icon>
              </button>
            </div>
            <div class={'ls-dv-button-group'}>
              <button onClick={() => this.top()} aria-label={dvI18n.t('alignment.aligntop')} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.aligntop')} disabled={this.readonly}>
                <ls-icon name="field-alignment-top-icon"></ls-icon>
              </button>
              <button onClick={() => this.middle()} aria-label={dvI18n.t('alignment.alignmiddle')} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.alignmiddle')} disabled={this.readonly}>
                <ls-icon name="field-alignment-middle-icon"></ls-icon>
              </button>
              <button onClick={() => this.bottom()} aria-label={dvI18n.t('alignment.alignbottom')} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.alignbottom')} disabled={this.readonly}>
                <ls-icon name="field-alignment-bottom-icon"></ls-icon>
              </button>
            </div>
          </div>
        </div>

        <slot></slot>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
