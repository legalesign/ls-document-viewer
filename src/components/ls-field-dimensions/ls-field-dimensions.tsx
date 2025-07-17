import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-dimensions',
  styleUrl: 'ls-field-dimensions.css',
  shadow: true,
})
export class LsFieldDimensions {
  @Prop() dataItem: LSApiElement | LSApiElement[];

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true
  }) mutate: EventEmitter<LSMutateEvent[]>;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true
  }) update: EventEmitter<LSMutateEvent[]>;


  isSingle(dt: LSApiElement | LSApiElement[]): dt is LSApiElement {
    return (dt as LSApiElement[]).length === undefined;
  }

  isMultiple(dt: LSApiElement | LSApiElement[]): dt is LSApiElement[] {
    return typeof (dt as LSApiElement[]).length === 'number';
  }

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff)
    if (this.isMultiple(this.dataItem)) {
      const diffs: LSMutateEvent[] = this.dataItem.map(c => {
        return { action: "update", data: { ...c, ...diff } as LSApiElement }
      })
      
      this.dataItem = diffs.map(d => d.data as LSApiElement)
      this.mutate.emit(diffs)
      this.update.emit(diffs)
    } else {
      const singleDiff = { action: 'update', data: { ...this.dataItem, ...diff } as LSApiElement } as LSMutateEvent
      this.dataItem = singleDiff.data as LSApiElement
      this.mutate.emit([singleDiff])
      this.update.emit([singleDiff])
    }
  }

  render() {
    return (
      <Host>
        {(this.isMultiple(this.dataItem)) &&
          <div class={"ls-field-properties-section"}>
            <div>Height: <input value={""} onChange={(e) => this.alter({ height: (e.target as HTMLInputElement).value })} width="30" /></div>
            <div>Width:  <input value={""} onChange={(e) => this.alter({ width: (e.target as HTMLInputElement).value })} width="30" /></div>
            <div>Top:  <input value={""} onChange={(e) => this.alter({ top: (e.target as HTMLInputElement).value })} width="30" /></div>
            <div>Left:  <input value={""} onChange={(e) => this.alter({ left: (e.target as HTMLInputElement).value })} width="30" /></div>
          </div>
        }
        {(this.isSingle(this.dataItem)) &&
          <div class={"ls-field-properties-section"}>
            <div>Height: <input value={this.dataItem?.height} onChange={(e) => this.alter({ height: (e.target as HTMLInputElement).value })} width="30" /></div>
            <div>Width:  <input value={this.dataItem?.width} onChange={(e) => this.alter({ width: (e.target as HTMLInputElement).value })} width="30" /></div>
            <div>Top:  <input value={this.dataItem?.top} onChange={(e) => this.alter({ top: (e.target as HTMLInputElement).value })} width="30" /></div>
            <div>Left:  <input value={this.dataItem?.left} onChange={(e) => this.alter({ left: (e.target as HTMLInputElement).value })} width="30" /></div>
          </div>}
      </Host>
    );
  }
}
