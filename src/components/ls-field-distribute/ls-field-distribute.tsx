import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LSApiElement, LSMutateEvent } from '../../components';
import { oob } from '../ls-document-viewer/editorUtils';
import { outOfBounds } from '../ls-document-viewer/mouseHandlers';

@Component({
  tag: 'ls-field-distribute',
  styleUrl: 'ls-field-distribute.scss',
  shadow: true,
})
export class LsFieldDistribute {
  @Prop({
    mutable: true,
  })
  dataItem: LSApiElement[];
  @Prop() readonly: boolean = false;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  mutate: EventEmitter<LSMutateEvent[]>;

  @Element() component: HTMLElement;

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

  distributeHorizontal() {
    if (!this.dataItem || this.dataItem.length < 3) return;
    
    var spacing = this.component.shadowRoot.getElementById('ls-fix-horizontal-space') as HTMLInputElement;
    const sorted = this.dataItem.sort((a, b) => a.left - b.left);


    var avgspace = 0;
    const leftmost = sorted[0].left + sorted[0].width / 2;
    const rightmost = sorted.reduce((acc, cur) => {
      return cur.left + (cur.width / 2) > acc ? cur.left + (cur.width / 2) : acc;
    }, leftmost);
    // find total width between centre first and centre last
    const totalWidth: number = rightmost - leftmost;

    if (spacing.value !== '') {
      avgspace = parseInt(spacing.value);
    } else {
      avgspace = Math.floor(totalWidth / (sorted.length - 1));
    }

    const filtered = sorted.filter((c, index) => {
      return outOfBounds({ ...c, left: (Math.floor(leftmost - (c.width / 2) + avgspace * index)) }) === false
        && index !== 0
        && index !== sorted.length - 1
    });

    const diffs: LSMutateEvent[] = filtered.map((c, index) => {

      return {
        action: 'update',
        data: {
          ...c,
          left: Math.floor(leftmost - (c.width / 2) + (avgspace * (index + 1))),
        } as LSApiElement,
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  gapVertical(spacing: number) {
    if (!this.dataItem || this.dataItem.length === 0) return;
    
    const sorted = this.dataItem.sort((a, b) => a.top - b.top);

    var buffer = sorted[0].top;

    const diffs: LSMutateEvent[] = sorted.map(c => {
      const newTop = buffer;
      buffer = buffer + c.height + spacing;
      const target = {
        ...c,
        top: newTop,
      } as LSApiElement;

      return {
        action: 'update',
        data: oob(target)
          ? ({
            ...c,
            left: c.pageDimensions.height - c.height - 1,
          } as LSApiElement)
          : target,
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  gapHorizontal(spacing: number) {
    if (!this.dataItem || this.dataItem.length === 0) return;
    
    const sorted = this.dataItem.sort((a, b) => a.top - b.top);

    var buffer = sorted[0].left;

    const diffs: LSMutateEvent[] = sorted.map(c => {
      const newLeft = buffer;
      buffer = buffer + c.width + spacing;
      const target = {
        ...c,
        left: newLeft,
      } as LSApiElement;

      console.log(target, oob(target));

      return {
        action: 'update',
        data: oob(target)
          ? ({
            ...c,
            left: c.pageDimensions.width - c.width - 1,
          } as LSApiElement)
          : target,
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  distributeVertical() {
    if (!this.dataItem || this.dataItem.length < 3) return;
    
    const sorted = this.dataItem.sort((a, b) => a.top - b.top);
    
    const firstBottom = sorted[0].top + sorted[0].height;
    const lastTop = sorted[sorted.length - 1].top;
    const availableSpace = lastTop - firstBottom;
    
    const middleFieldsHeight = sorted.slice(1, -1).reduce((sum, field) => sum + field.height, 0);
    
    const numGaps = sorted.length - 1;
    const gap = Math.max(0, (availableSpace - middleFieldsHeight) / numGaps);
    
    let currentTop = sorted[0].top + sorted[0].height + gap;
    
    const diffs: LSMutateEvent[] = sorted.slice(1, -1).map((c) => {
      const newTop = Math.floor(currentTop);
      currentTop += c.height + gap;
      
      return {
        action: 'update',
        data: {
          ...c,
          top: newTop,
        } as LSApiElement,
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
            <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.distribution')}</p>
            <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.distributiondescription')}</p>
          </div>
          <div class={'ls-dv-button-group'}>
            <button
              onClick={() => {
                this.distributeVertical();
              }}
              aria-label={dvI18n.t('alignment.distributevertically')}
              data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.distributevertically')}
              disabled={this.readonly}
            >
              <ls-icon name="field-distribute-vertically-icon"></ls-icon>
            </button>
            <button
              onClick={() => {
                this.distributeHorizontal();
              }}
              aria-label={dvI18n.t('alignment.distributehorizontally')}
              data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.distributehorizontally')}
              disabled={this.readonly}
            >
              <ls-icon name="field-distribute-horizontally-icon"></ls-icon>
            </button>
          </div>
        </div>
        <div class={'ls-dv-field-properties-section'}>
          <div class={'ls-dv-field-properties-section-text'}>
            <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.gap')}</p>
            <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.gapdescription')}</p>
          </div>
          <div class={'ls-dv-input-row'}>
            <div class={'ls-dv-input-wrapper'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('placement.setverticalgap')}>
              <ls-icon id="selectLeadingIcon" name="field-distribute-vertically-icon"></ls-icon>
              <input
                type="number"
                class={'ls-dv-has-leading-icon'}
                id="ls-fix-vertical-space"
                onChange={e => {
                  this.gapVertical(parseInt((e.target as HTMLInputElement).value));
                }}
                min={0}
                max={9999}
                value={''}
                size={4}
                disabled={this.readonly}
              />
            </div>
            <div class={'ls-dv-input-wrapper'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('placement.sethorizontalgap')}>
              <ls-icon id="selectLeadingIcon" name="field-distribute-horizontally-icon"></ls-icon>
              <input
                type="number"
                class={'ls-dv-has-leading-icon'}
                id="ls-fix-horizontal-space"
                onChange={e => {
                  this.gapHorizontal(parseInt((e.target as HTMLInputElement).value));
                }}
                min={0}
                max={9999}
                value={''}
                size={4}
                disabled={this.readonly}
              />
            </div>
          </div>
        </div>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
        <slot></slot>
      </Host>
    );
  }
}
