import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { oob } from '../ls-document-viewer/editorUtils';

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

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  update: EventEmitter<LSMutateEvent[]>;
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
    this.update.emit(diffs);
  }

  distributeHorizontal() {
    var spacing = this.component.shadowRoot.getElementById('ls-fix-horizontal-space') as HTMLInputElement;
    var avgspace = 0;
    const sorted = this.dataItem.sort((a, b) => a.left - b.left);

    if (spacing.value !== '') {
      avgspace = parseInt(spacing.value);
    } else {
      var space = 0;
      for (var i = 1; i < sorted.length; i++) {
        const c1 = sorted[i - 1];
        const c2 = sorted[i];
        space = space + (c2.left - c1.left - c1.width <= 0 ? 0 : c2.left - c1.left - c1.width);
      }
      avgspace = Math.floor(space / sorted.length);
    }

    var nextleft = sorted[0].left;

    const diffs: LSMutateEvent[] = sorted.map(c => {
      const newLeft = nextleft;
      nextleft = nextleft + c.width + avgspace;

      return {
        action: 'update',
        data: {
          ...c,
          left: newLeft
        } as LSApiElement,
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  gapVertical(spacing: number) {
    const sorted = this.dataItem.sort((a, b) => a.top - b.top);

    var buffer = sorted[0].top;

    const diffs: LSMutateEvent[] = sorted.map(c => {
      const newTop = buffer;
      buffer = buffer + c.height + spacing;
      const target = {
        ...c,
        top: newTop
      } as LSApiElement

      return {
        action: 'update',
        data: oob(target) ? {
          ...c,
          left: c.pageDimensions.height - c.height - 1
        } as LSApiElement : target
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  gapHorizontal(spacing: number) {
    const sorted = this.dataItem.sort((a, b) => a.top - b.top);

    var buffer = sorted[0].left;

    const diffs: LSMutateEvent[] = sorted.map(c => {
      const newLeft = buffer;
      buffer = buffer + c.width + spacing;
      const target = {
        ...c,
        left: newLeft
      } as LSApiElement

      console.log(target, oob(target));

      return {
        action: 'update',
        data: oob(target) ? {
          ...c,
          left: c.pageDimensions.width - c.width - 1
        } as LSApiElement : target
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  distributeVertical() {
    var spacing = this.component.shadowRoot.getElementById('ls-fix-vertical-space') as HTMLInputElement;
    var avgspace = 0;
    const sorted = this.dataItem.sort((a, b) => a.top - b.top);

    if (spacing.value !== '') avgspace = parseInt(spacing.value);
    else {
      var space = 0;
      for (var i = 1; i < sorted.length; i++) {
        const c1 = sorted[i - 1];
        const c2 = sorted[i];
        space = space + (c2.top - c1.top - c1.height <= 0 ? 0 : c2.top - c1.top - c1.height);
      }
      avgspace = Math.floor(space / sorted.length);
    }

    var buffer = sorted[0].top;

    const diffs: LSMutateEvent[] = sorted.map(c => {
      const newTop = buffer;
      buffer = buffer + c.height + avgspace;
      const target = {
        ...c,
        top: newTop
      } as LSApiElement

      return {
        action: 'update',
        data: oob(target) ? {
          ...c,
          top: c.pageDimensions.height - c.height
        } as LSApiElement : target
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
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
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Distribute selected fields vertically."
              data-tooltip-place="top"
            >
              <ls-icon name="field-distribute-vertically"></ls-icon>
            </button>
            <button
              onClick={() => {
                this.distributeHorizontal();
              }}
              aria-label="Distribute selected fields horizontally."
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Distribute selected fields horizontally."
              data-tooltip-place="top"
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
            <div class={'input-wrapper'}>
              <ls-icon id="selectLeadingIcon" name="field-distribute-vertically"></ls-icon>
              <input type="number" class={'has-leading-icon'} id="ls-fix-vertical-space" onChange={(e) => {
                this.gapVertical(parseInt((e.target as HTMLInputElement).value));
              }} value={''} size={4} min={0} max={9999} />
            </div>
            <div class={'input-wrapper'}>
              <ls-icon id="selectLeadingIcon" name="field-distribute-horizontally"></ls-icon>
              <input type="number" class={'has-leading-icon'} id="ls-fix-horizontal-space" onChange={(e) => {
                this.gapHorizontal(parseInt((e.target as HTMLInputElement).value));
              }} value={''} size={4} min={0} max={9999} />
            </div>
          </div>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
