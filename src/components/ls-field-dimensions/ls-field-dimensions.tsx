import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { Element } from '@stencil/core';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-field-dimensions',
  styleUrl: 'ls-field-dimensions.css',
  shadow: true,
})
export class LsFieldDimensions {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement | LSApiElement[];

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

  isSingle(dt: LSApiElement | LSApiElement[]): dt is LSApiElement {
    return (dt as LSApiElement[]).length === undefined;
  }

  isMultiple(dt: LSApiElement | LSApiElement[]): dt is LSApiElement[] {
    return typeof (dt as LSApiElement[]).length === 'number';
  }

  getDataItem(): LSApiElement {
    if (this.isSingle(this.dataItem)) {
      return this.dataItem;
    }
    return this.dataItem[0];
  }

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff);
    if (this.isMultiple(this.dataItem)) {
      const diffs: LSMutateEvent[] = this.dataItem.map(c => {
        return { action: 'update', data: { ...c, ...diff } as LSApiElement };
      });

      this.dataItem = diffs.map(d => d.data as LSApiElement);
      this.mutate.emit(diffs);
    } else {
      const singleDiff = { action: 'update', data: { ...this.dataItem, ...diff } as LSApiElement } as LSMutateEvent;
      this.dataItem = singleDiff.data as LSApiElement;
      this.mutate.emit([singleDiff]);
    }
  }

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
  }

  render() {
    return (
      <Host>
        {this.isMultiple(this.dataItem) && (
          <div class={'ls-field-properties-section'}>
            <div class={'ls-field-properties-section-text'}>
              <p class={'ls-field-properties-section-title'}>Height and Width</p>
              <p class={'ls-field-properties-section-description'}>Define the height and width of one or multiple fields</p>
            </div>
            <div class={'input-row'}>
              <div class={'input-wrapper'} data-tooltip="Set field width in pixels">
                <ls-icon id="selectLeadingIcon" name="field-match-width"></ls-icon>
                <input class={'has-leading-icon'} aria="field-width" id="field-width" onChange={e => this.alter({ width: (e.target as HTMLInputElement).value })} />
              </div>
              <div class={'input-wrapper'} data-tooltip="Set field height in pixels">
                <ls-icon id="selectLeadingIcon" name="field-match-height"></ls-icon>
                <input class={'has-leading-icon'} aria="field-height" id="field-height" onChange={e => this.alter({ height: (e.target as HTMLInputElement).value })} />
              </div>
            </div>

            {/* <div>
              Top: <input value={''} onChange={e => this.alter({ top: (e.target as HTMLInputElement).value })} width="30" />
            </div>
            <div>
              Left: <input value={''} onChange={e => this.alter({ left: (e.target as HTMLInputElement).value })} width="30" />
            </div> */}
          </div>
        )}
        {this.isSingle(this.dataItem) && (
          <div class={'field-set'}>
            <div class={'ls-field-properties-section'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Height and Width</p>
                <p class={'ls-field-properties-section-description'}>Define the height and width of one or multiple fields</p>
              </div>
              <div class={'input-row'}>
                <div class={'input-wrapper'} data-tooltip="Set field width in pixels">
                  <ls-icon id="selectLeadingIcon" name="field-match-width"></ls-icon>
                  <input
                    type="number"
                    class={'has-leading-icon'}
                    aria="field-width"
                    id="field-width"
                    min={5}
                    max={this.dataItem.pageDimensions.width - this.dataItem.width}
                    value={this.dataItem?.width}
                    onChange={e => {
                      const di = this.getDataItem();
                      if (parseInt((e.target as HTMLInputElement).value) > di.pageDimensions.width - di.left) {
                        return;
                      }
                      this.alter({ width: (e.target as HTMLInputElement).value })
                    }}
                  />
                </div>
                <div class={'input-wrapper'} data-tooltip="Set field height in pixels">
                  <ls-icon id="selectLeadingIcon" name="field-match-height"></ls-icon>
                  <input
                    type="number"
                    class={'has-leading-icon'}
                    aria="field-height"
                    id="field-height"
                    value={this.dataItem?.height}
                    onChange={e => {
                      const di = this.getDataItem();
                      if (parseInt((e.target as HTMLInputElement).value) > di.pageDimensions.height - di.top) {
                        return;
                      }

                      this.alter({ height: (e.target as HTMLInputElement).value })
                    }}
                  />
                </div>
              </div>
            </div>

            <div class={'ls-field-properties-section'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Scale and Resize</p>
                <p class={'ls-field-properties-section-description'}>Multi-select fields and match their dimensions</p>
              </div>
              <div class={'button-group'}>
                <button disabled data-tooltip="Select multiple Fields to to access scale controls">
                  <ls-icon name="field-scale"></ls-icon>
                </button>
                <button disabled data-tooltip="Select multiple Fields to to access match width controls">
                  <ls-icon name="field-match-width"></ls-icon>
                </button>
                <button disabled data-tooltip="Select multiple Fields to to access match height controls">
                  <ls-icon name="field-match-height"></ls-icon>
                </button>
              </div>
            </div>
          </div>
        )}
        <ls-tooltip id="ls-tooltip-master" />
      </Host>
    );
  }
}
