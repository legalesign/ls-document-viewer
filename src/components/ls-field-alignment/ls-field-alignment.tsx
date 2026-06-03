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

  right() {
    const rightmost = this.dataItem.reduce((rightmost, current) => {
      return current.left + current.width < rightmost ? rightmost : current.left + current.width;
    }, 0);

    console.log(rightmost);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newLeft = rightmost - c.width;

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
    const addcentres = this.dataItem.reduce((total, current) => {
      console.log(total + (current.left + current.width / 2));
      return total + (current.left + current.width / 2);
    }, 0);
    console.log(addcentres);

    const cp = addcentres / this.dataItem.length;
    console.log('centerposition', cp);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newLeft = c.left + (cp - (c.left + c.width / 2));
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
    console.log(diffs);
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  top() {
    const topmost = this.dataItem.reduce((most, current) => {
      return current.top < most ? most : current.top;
    }, 0);

    this.alter({ top: topmost });
  }

  left() {
    const leftmost = this.dataItem.reduce((least, current) => {
      return current.left < least ? current.left : least;
    }, this.dataItem[0].left);

    this.alter({ left: leftmost });
  }

  middle() {
    const addmiddles = this.dataItem.reduce((total, current) => {
      console.log(total + (current.top + current.height / 2));
      return total + (current.top + current.height / 2);
    }, 0);

    const cp = addmiddles / this.dataItem.length;

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newTop = c.top + (cp - (c.top + c.height / 2));
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
    const lowest = this.dataItem.reduce((acc, current) => {
      return acc > current.top + current.height ? acc : current.top + current.height;
    }, 0);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newTop = lowest - c.height;
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
                <ls-icon name="field-alignment-left-icon"></ls-icon>
              </button>
              <button onClick={() => this.center()} aria-label={dvI18n.t('alignment.aligncenter')} data-tooltip={dvI18n.t('alignment.aligncenter')}>
                <ls-icon name="field-alignment-centre-icon"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.right();
                }}
                aria-label={dvI18n.t('alignment.alignright')}
                data-tooltip={dvI18n.t('alignment.alignright')}
              >
                <ls-icon name="field-alignment-right-icon"></ls-icon>
              </button>
            </div>
            <div class={'ls-dv-button-group'}>
              <button onClick={() => this.top()} aria-label={dvI18n.t('alignment.aligntop')} data-tooltip={dvI18n.t('alignment.aligntop')}>
                <ls-icon name="field-alignment-top-icon"></ls-icon>
              </button>
              <button onClick={() => this.middle()} aria-label={dvI18n.t('alignment.alignmiddle')} data-tooltip={dvI18n.t('alignment.alignmiddle')}>
                <ls-icon name="field-alignment-middle-icon"></ls-icon>
              </button>
              <button onClick={() => this.bottom()} aria-label={dvI18n.t('alignment.alignbottom')} data-tooltip={dvI18n.t('alignment.alignbottom')}>
                <ls-icon name="field-alignment-bottom-icon"></ls-icon>
              </button>
            </div>
          </div>
        </div>

        <slot></slot>
        <ls-dv-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
