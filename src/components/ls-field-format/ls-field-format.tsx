import { Component, EventEmitter, Host, Prop, h, Element, Event } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-format',
  styleUrl: 'ls-field-format.css',
  shadow: true,
})
export class LsFieldFormat {
  @Prop({
    mutable: true
  }) dataItem: LSApiElement[];

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
  @Element() component: HTMLElement;


  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff)

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: "update", data: { ...c, ...diff } as LSApiElement }
    })

    this.dataItem = diffs.map(d => d.data as LSApiElement)
    this.mutate.emit(diffs)
    this.update.emit(diffs)
  }
  render() {
    return (
      <Host>
        {this.dataItem && this.dataItem.length > 1 &&
          <div class={"ls-field-format-bar"}>
            <select onChange={(input) => {
              this.alter({ fontName: (input.target as HTMLSelectElement).value })             
            }}>
              <option value="arial">Arial</option>
              <option value="liberation sans">Liberation Sans</option>
              <option value="courier">Courier</option>
              <option value="helvetica">Helvetica</option>
              <option value="verdana">Verdana</option>
            </select>
            <input width="30" size={4} />
            <select>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>}
        {this.dataItem && this.dataItem.length === 1 &&
          <div class={"ls-field-format-bar"}>
            <select onChange={(input) => {
              this.alter({fontName: (input.target as HTMLSelectElement).value})             
            }}>
              <option value="arial">Arial</option>
              <option value="liberation sans">Liberation Sans</option>
              <option value="courier">Courier</option>
              <option value="helvetica">Helvetica</option>
              <option value="verdana">Verdana</option>
            </select>
            <input width="30" size={4} value={this.dataItem[0].fontSize} onChange={(input) => {
              this.alter({fontSize: (input.target as HTMLInputElement).value})             
            }}/>
            <select onChange={(input) => {
              this.alter({align: (input.target as HTMLSelectElement).value})             
            }}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>}

      </Host>
    );
  }
}
