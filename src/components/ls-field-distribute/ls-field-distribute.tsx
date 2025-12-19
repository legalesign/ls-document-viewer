import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { oob } from '../ls-document-viewer/editorUtils';
import { attachAllTooltips } from '../../utils/tooltip';
import { outOfBounds } from '../ls-document-viewer/mouseHandlers';

@Component({
  tag: 'ls-field-distribute',
  styleUrl: 'ls-field-distribute.css',
  shadow: true,
})
export class LsFieldDistribute {
  @Prop({
    mutable: true,
  })
  dataItem: LSApiElement[];

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
    var spacing = this.component.shadowRoot.getElementById('ls-fix-horizontal-space') as HTMLInputElement;
    const sorted = this.dataItem.sort((a, b) => a.left - b.left);
    if (sorted.length < 3) return;


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
    var spacing = this.component.shadowRoot.getElementById('ls-fix-vertical-space') as HTMLInputElement;
    var avgspace = 0;
    const sorted = this.dataItem.sort((a, b) => a.top - b.top);

    const topmost = sorted[0].top + sorted[0].height / 2;
    const bottommost = sorted.reduce((acc, cur) => {
      return cur.top + (cur.height / 2) > acc ? cur.top + (cur.height / 2) : acc;
    }, topmost);
    // find total width between centre first and centre last
    const totalHeight: number = bottommost - topmost;

    if (spacing.value !== '') {
      avgspace = parseInt(spacing.value);
    } else {
      avgspace = Math.floor(totalHeight / (sorted.length - 1));
    }

    const filtered = sorted.filter((c, index) => {
      return outOfBounds({ ...c, left: Math.floor(topmost - (c.height / 2) + avgspace * index) }) === false
        && index !== 0
        && index !== sorted.length - 1
    });

    const diffs: LSMutateEvent[] = filtered.map((c, index) => {

      return {
        action: 'update',
        data: {
          ...c,
          top: Math.floor(topmost - (c.height / 2) + (avgspace * (index + 1))),
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
        <div class={'ls-field-properties-section'}>
          <div class={'ls-field-properties-section-text'}>
            <p class={'ls-field-properties-section-title'}>Distribution</p>
            <p class={'ls-field-properties-section-description'}>Multi-select fields and evenly space them out</p>
          </div>
          <div class={'button-group'}>
            <button
              onClick={() => {
                this.distributeVertical();
              }}
              aria-label="Distribute selected fields vertically."
              data-tooltip="Distribute selected fields vertically"
            >
              <ls-icon name="field-distribute-vertically"></ls-icon>
            </button>
            <button
              onClick={() => {
                this.distributeHorizontal();
              }}
              aria-label="Distribute selected fields horizontally."
              data-tooltip="Distribute selected fields horizontally"
            >
              <ls-icon name="field-distribute-horizontally"></ls-icon>
            </button>
          </div>
        </div>
        <div class={'ls-field-properties-section'}>
          <div class={'ls-field-properties-section-text'}>
            <p class={'ls-field-properties-section-title'}>Gap</p>
            <p class={'ls-field-properties-section-description'}>Define the exact gap between multi-select fields.</p>
          </div>
          <div class={'input-row'}>
            <div class={'input-wrapper'} data-tooltip="Set vertical gap between selected fields">
              <ls-icon id="selectLeadingIcon" name="field-distribute-vertically"></ls-icon>
              <input
                type="number"
                class={'has-leading-icon'}
                id="ls-fix-vertical-space"
                onChange={e => {
                  this.gapVertical(parseInt((e.target as HTMLInputElement).value));
                }}
                value={''}
                size={4}
                min={0}
                max={9999}
              />
            </div>
            <div class={'input-wrapper'} data-tooltip="Set horizontal gap between selected fields">
              <ls-icon id="selectLeadingIcon" name="field-distribute-horizontally"></ls-icon>
              <input
                type="number"
                class={'has-leading-icon'}
                id="ls-fix-horizontal-space"
                onChange={e => {
                  this.gapHorizontal(parseInt((e.target as HTMLInputElement).value));
                }}
                value={''}
                size={4}
                min={0}
                max={9999}
              />
            </div>
          </div>
        </div>
        <ls-tooltip id="ls-tooltip-master" />
        <slot></slot>
      </Host>
    );
  }
}
