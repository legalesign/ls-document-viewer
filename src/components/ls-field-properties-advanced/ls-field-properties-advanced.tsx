import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent'

@Component({
  tag: 'ls-field-properties-advanced',
  styleUrl: 'ls-field-properties-advanced.css',
  shadow: true,
})
export class LsFieldPropertiesAdvanced {
  @Prop({ mutable: true }) dataItem: LSApiElement;

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

  alter(diff: object) {
    const singleDiff = { action: 'update', data: { ...this.dataItem, ...diff } as LSApiElement } as LSMutateEvent;
    this.dataItem = singleDiff.data as LSApiElement;
    this.mutate.emit([singleDiff]);
    this.update.emit([singleDiff]);
  }

  render() {
    return (
      <Host>
          <div class={'ls-field-properties-section'}>
            <div class={'ls-field-properties-section-text'}>
              <p class={'ls-field-properties-section-title'}>Field Order</p>
              <p class={'ls-field-properties-section-description'}>Determines what order fields will be filled in by the user</p>
            </div>
            <div class={'input-row'}>
              <div class={'input-wrapper'}>
                <input value={this.dataItem?.fieldOrder} width="30" placeholder="eg. Sign Here" onChange={e => this.alter({ fieldOrder: (e.target as HTMLInputElement).value })} />
              </div>
            </div>
          </div>


          <div class={'ls-field-properties-section'}>
            <div class={'ls-field-properties-section-text'}>
              <p class={'ls-field-properties-section-title'}>Ref Name</p>
            </div>
            <div class={'input-row'}>
              <div class={'input-wrapper'}>
                <input value={this.dataItem?.link} width="30" placeholder="" onChange={e => this.alter({ link: (e.target as HTMLInputElement).value })} />
              </div>
            </div>

            <div class={'ls-field-properties-section-text'}>
              <p class={'ls-field-properties-section-title'}>Link Field</p>
            </div>
            <div class={'input-row'}>
              <div class={'input-wrapper'}>
                <input value={this.dataItem?.logicGroup} width="30" placeholder="" onChange={e => this.alter({ logicGroup: (e.target as HTMLInputElement).value })} />
              </div>
            </div>

              <div class={'ls-field-properties-section-text'}>
              <p class={'ls-field-properties-section-title'}>Link Value</p>
            </div>
            <div class={'input-row'}>
              <div class={'input-wrapper'}>
                <input value={this.dataItem?.logicAction} width="30" placeholder="" onChange={e => this.alter({ logicAction: (e.target as HTMLInputElement).value })} />
              </div>
            </div>
          </div>
      </Host>
    );
  }
}
