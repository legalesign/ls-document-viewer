import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LSApiElement, LSMutateEvent } from '../../components';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-field-alignment',
  styleUrl: 'ls-field-alignment.scss',
  shadow: true,
})
export class LsFieldAlignment {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement[];
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
  getAnchorControl(): LSApiElement {
    return this.dataItem.reduce((topLeftMost, current) => {
      // Prioritize top position first, then left if tops are equal
      if (current.top < topLeftMost.top) {
        return current;
      } else if (current.top === topLeftMost.top && current.left < topLeftMost.left) {
        return current;
      }
      return topLeftMost;
    }, this.dataItem[0]);
  }

  right() {
    const anchor = this.getAnchorControl();
    const alignTo = anchor.left + anchor.width;

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newLeft = alignTo - c.width;

      return {
        action: 'update',
        data: {
          ...c,
          left: newLeft,
          ax: newLeft,
          bx: newLeft + c.width,
        } as LSApiElement,
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  center() {
    const anchor = this.getAnchorControl();
    const alignTo = anchor.left + anchor.width / 2;

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newLeft = alignTo - c.width / 2;
      return {
        action: 'update',
        data: {
          ...c,
          left: newLeft,
          ax: newLeft,
          bx: newLeft + c.width,
        } as LSApiElement,
      };
    });
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  top() {
    const anchor = this.getAnchorControl();
    this.alter({ top: anchor.top });
  }

  left() {
    const anchor = this.getAnchorControl();
    this.alter({ left: anchor.left });
  }

  middle() {
    const anchor = this.getAnchorControl();
    const alignTo = anchor.top + anchor.height / 2;

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newTop = alignTo - c.height / 2;
      return {
        action: 'update',
        data: {
          ...c,
          top: newTop,
          ay: newTop,
          by: newTop + c.height,
        } as LSApiElement,
      };
    });
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  bottom() {
    const anchor = this.getAnchorControl();
    const alignTo = anchor.top + anchor.height;

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newTop = alignTo - c.height;
      return {
        action: 'update',
        data: {
          ...c,
          top: newTop,
          ay: newTop,
          by: newTop + c.height,
        } as LSApiElement,
      };
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
            <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.alignment')}</p>
            <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.alignmentdescription')}</p>
          </div>
          <div class={'ls-dv-multi-button-group-row'}>
            <div class={'ls-dv-button-group'}>
              <button onClick={() => this.left()} aria-label={dvI18n.t('alignment.alignleft')} data-tooltip={dvI18n.t('alignment.alignleft')}>
                <ls-icon name="field-alignment-left"></ls-icon>
              </button>
              <button onClick={() => this.center()} aria-label={dvI18n.t('alignment.aligncenter')} data-tooltip={dvI18n.t('alignment.aligncenter')}>
                <ls-icon name="field-alignment-centre"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.right();
                }}
                aria-label={dvI18n.t('alignment.alignright')}
                data-tooltip={dvI18n.t('alignment.alignright')}
              >
                <ls-icon name="field-alignment-right"></ls-icon>
              </button>
            </div>
            <div class={'ls-dv-button-group'}>
              <button onClick={() => this.top()} aria-label={dvI18n.t('alignment.aligntop')} data-tooltip={dvI18n.t('alignment.aligntop')}>
                <ls-icon name="field-alignment-top"></ls-icon>
              </button>
              <button onClick={() => this.middle()} aria-label={dvI18n.t('alignment.alignmiddle')} data-tooltip={dvI18n.t('alignment.alignmiddle')}>
                <ls-icon name="field-alignment-middle"></ls-icon>
              </button>
              <button onClick={() => this.bottom()} aria-label={dvI18n.t('alignment.alignbottom')} data-tooltip={dvI18n.t('alignment.alignbottom')}>
                <ls-icon name="field-alignment-bottom"></ls-icon>
              </button>
            </div>
          </div>
        </div>

        <slot></slot>
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
