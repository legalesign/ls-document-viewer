import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-size',
  styleUrl: 'ls-field-size.css',
  shadow: true,
})
export class LsFieldSize {
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
    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
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
            <p class={'ls-field-properties-section-title'}>Scale and Resize</p>
            <p class={'ls-field-properties-section-description'}>Multi-select fields and match their dimensions</p>
          </div>
          <div class={'button-group'}>
            <button
              onClick={() => this.alter({ width: this.dataItem[0].width, height: this.dataItem[0].height })}
              aria-label="Make selected fields the same height and width as the first selected field."
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Make selected fields the same height and width as the first selected field."
              data-tooltip-place="top"
            >
              <ls-icon name="field-scale"></ls-icon>
            </button>
            <button
              aria-label="Make selected fields the same width as the first selected field."
              onClick={() => this.alter({ width: this.dataItem[0].width })}
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Make selected fields the same width as the first selected field."
              data-tooltip-place="top"
            >
              <ls-icon name="field-match-width"></ls-icon>
            </button>
            <button
              onClick={() => this.alter({ height: this.dataItem[0].height })}
              aria-label="Make selected fields the same height as the first selected field."
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Make selected fields the same height as the first selected field."
              data-tooltip-place="top"
            >
              <ls-icon name="field-match-height"></ls-icon>
            </button>
          </div>
        </div>

        <slot></slot>
      </Host>
    );
  }
}
