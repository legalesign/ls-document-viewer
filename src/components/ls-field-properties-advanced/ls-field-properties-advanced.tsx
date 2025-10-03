import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent'

@Component({
  tag: 'ls-field-properties-advanced',
  styleUrl: 'ls-field-properties-advanced.css',
  shadow: true,
})
export class LsFieldPropertiesAdvanced {
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

  alter(diff: object) {
    let diffs = []
    if(this.isMultiple(this.dataItem)) {
      this.dataItem = this.dataItem.map(di => { return { ...di, ...diff } as LSApiElement });

      diffs = this.dataItem.map(di => { return { action: 'update', data: { ...di, ...diff } as LSApiElement } as LSMutateEvent });
    } else if(this.isMultiple(this.dataItem)) {
      this.dataItem = { ...this.dataItem, ...diff };  

      diffs = [{ action: 'update', data: { ...this.dataItem, ...diff }}];
    }
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }
  
  getValue(key) {
    if(this.isMultiple(this.dataItem)) {
      return "";
    } else if(this.isSingle(this.dataItem)) {
      return this.dataItem[key]
    }
    return ''
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
              <input value={this.getValue('fieldOrder')} width="30" placeholder="eg. Sign Here" onChange={e => this.alter({ fieldOrder: (e.target as HTMLInputElement).value })} />
            </div>
          </div>
        </div>


        <div class={'ls-field-properties-section'}>
          <div class={'ls-field-properties-section-text'}>
            <p class={'ls-field-properties-section-title'}>Ref Name</p>
          </div>
          <div class={'input-row'}>
            <div class={'input-wrapper'}>
              <input value={this.getValue('link')} width="30" placeholder="" onChange={e => this.alter({ link: (e.target as HTMLInputElement).value })} />
            </div>
          </div>

          <div class={'ls-field-properties-section-text'}>
            <p class={'ls-field-properties-section-title'}>Link Field</p>
          </div>
          <div class={'input-row'}>
            <div class={'input-wrapper'}>
              <input value={this.getValue('logicGroup')} width="30" placeholder="" onChange={e => this.alter({ logicGroup: (e.target as HTMLInputElement).value })} />
            </div>
          </div>

          <div class={'ls-field-properties-section-text'}>
            <p class={'ls-field-properties-section-title'}>Link Value</p>
          </div>
          <div class={'input-row'}>
            <div class={'input-wrapper'}>
              <input value={this.getValue('logicAction')} width="30" placeholder="" onChange={e => this.alter({ logicAction: (e.target as HTMLInputElement).value })} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
