import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-placement',
  styleUrl: 'ls-field-placement.css',
  shadow: true,
})
export class LsFieldPlacement {
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
      this.update.emit(diffs);
    } else {
      const singleDiff = { action: 'update', data: { ...this.dataItem, ...diff } as LSApiElement } as LSMutateEvent;
      this.dataItem = singleDiff.data as LSApiElement;
      this.mutate.emit([singleDiff]);
      this.update.emit([singleDiff]);
    }
  }

  render() {
    return (
      <Host>
        {this.isMultiple(this.dataItem) && (
          <div class={'ls-field-properties-section'}>
            <div class={'ls-field-properties-section-text'}>
              <p class={'ls-field-properties-section-title'}>Location</p>
              <p class={'ls-field-properties-section-description'}>Use coordinates to move your fields on the page</p>
            </div>
            <div class={'input-row'}>
              <div class={'input-wrapper'}>
                <ls-icon id="selectLeadingIcon" name="x-letter"></ls-icon>
                <input type="number" class={'has-leading-icon'} aria="top-location" id="top-location" onChange={e => this.alter({ left: (e.target as HTMLInputElement).value })} />
              </div>
              <div class={'input-wrapper'}>
                <ls-icon id="selectLeadingIcon" name="y"></ls-icon>
                <input
                  type="number"
                  class={'has-leading-icon'}
                  aria="left-location"
                  id="left-location"
                  onChange={e => this.alter({ top: (e.target as HTMLInputElement).value })}
                />
              </div>
            </div>
          </div>
        )}
        {this.isSingle(this.dataItem) && (
          <div class={'field-set'}>
            {/* @Alex I couldn't get this to work?? Only Top and Left */}

            <div class={'ls-field-properties-section'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Alignment</p>
                <p class={'ls-field-properties-section-description'}>Align your Fields relative to the page or multi-select and align then to each other.</p>
              </div>
              <div class={'multi-button-group-row'}>
                <div class={'button-group'}>
                  <button onClick={() => this.alter({ left: 0 })}>
                    <ls-icon name="field-alignment-left"></ls-icon>
                  </button>
                  <button disabled>
                    <ls-icon name="field-alignment-centre"></ls-icon>
                  </button>
                  <button disabled>
                    <ls-icon name="field-alignment-right"></ls-icon>
                  </button>
                </div>
                <div class={'button-group'}>
                  <button onClick={() => this.alter({ top: 0 })}>
                    <ls-icon name="field-alignment-top"></ls-icon>
                  </button>
                  <button disabled>
                    <ls-icon name="field-alignment-middle"></ls-icon>
                  </button>
                  <button disabled>
                    <ls-icon name="field-alignment-bottom"></ls-icon>
                  </button>
                </div>
              </div>
            </div>

            <div class={'ls-field-properties-section'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Location</p>
                <p class={'ls-field-properties-section-description'}>Use coordinates to move your fields on the page</p>
              </div>
              <div class={'input-row'}>
                <div class={'input-wrapper'}>
                  <ls-icon id="selectLeadingIcon" name="x-letter"></ls-icon>
                  <input
                    type="number"
                    class={'has-leading-icon'}
                    aria="top-location"
                    id="top-location"
                    value={this.dataItem?.left}
                    onChange={e => this.alter({ left: (e.target as HTMLInputElement).value })}
                  />
                </div>
                <div class={'input-wrapper'}>
                  <ls-icon id="selectLeadingIcon" name="y"></ls-icon>
                  <input
                    type="number"
                    class={'has-leading-icon'}
                    aria="left-location"
                    id="left-location"
                    value={this.dataItem?.top}
                    onChange={e => this.alter({ top: (e.target as HTMLInputElement).value })}
                    width="30"
                  />
                </div>
              </div>
            </div>

            <div class={'ls-field-properties-section'}>
              <div class={'ls-field-properties-section-text'}>
                <p class={'ls-field-properties-section-title'}>Distribution</p>
                <p class={'ls-field-properties-section-description'}>Multi-select fields and evenly space them out</p>
              </div>
              <div class={'button-group'}>
                <button disabled>
                  <ls-icon name="field-distribute-vertically"></ls-icon>
                </button>
                <button disabled>
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
                  <ls-icon id="selectLeadingIconDisabled" name="field-distribute-vertically"></ls-icon>
                  <input type="number" value="0" class={'has-leading-icon'} aria="vertical-gap" id="vertical-gap" disabled />
                </div>
                <div class={'input-wrapper'}>
                  <ls-icon id="selectLeadingIconDisabled" name="field-distribute-horizontally"></ls-icon>
                  <input type="number" value="0" class={'has-leading-icon'} aria="horizontal-gap" id="horizontal-gap" disabled />
                </div>
              </div>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
