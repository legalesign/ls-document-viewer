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
    composed: true
  }) mutate: EventEmitter<LSMutateEvent[]>;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true
  }) update: EventEmitter<LSMutateEvent[]>;


  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff)

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: "update", data: { ...c, ...diff } as LSApiElement }
    })

    this.dataItem = diffs.map(d => d.data)
    this.mutate.emit(diffs)
    this.update.emit(diffs)
  }

  render() {
    return (
      <Host>
        <div class="flex rounded-[10px] focus:outline-hidden focus:ring-4 focus:ring-offset-0 focus:ring-primary-30">
          <button aria-label="Make selected fields the same width as the first selected field."
            class="ls-round-button"
            onClick={()=> this.alter({width: this.dataItem[0].width})}
            data-tooltip-id="le-tooltip" data-tooltip-content="Make selected fields the same width as the first selected field." data-tooltip-place="top">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 9V6C14 5.44772 13.5523 5 13 5H11C10.4477 5 10 5.44772 10 6V9M14 15.0104V18C14 18.5523 13.5523 19 13 19H11C10.4477 19 10 18.5523 10 18V15.0104M6.00751 15.0104L4.00751 12M4.00751 12L6.00751 9M4.00751 12H20.0013M18.0013 15.0104L20.0013 12M20.0013 12L18.0013 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <button class="ls-round-button" 
          onClick={()=>this.alter({height: this.dataItem[0].height})}
          aria-label="Make selected fields the same height as the first selected field."
            data-tooltip-id="le-tooltip" data-tooltip-content="Make selected fields the same height as the first selected field." data-tooltip-place="top">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.00439 10.0042H6.00439C5.45211 10.0042 5.00439 10.4519 5.00439 11.0042V13.0042C5.00439 13.5565 5.45211 14.0042 6.00439 14.0042H9.00439M15.0148 10.0042H18.0044C18.5567 10.0042 19.0044 10.4519 19.0044 11.0042V13.0042C19.0044 13.5565 18.5567 14.0042 18.0044 14.0042H15.0148M15.0148 17.9967L12.0044 19.9967M12.0044 19.9967L9.00439 17.9968M12.0044 19.9967V4.00293M15.0148 6.00299L12.0044 4.00293M12.0044 4.00293L9.00439 6.00293" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
          <button class="ls-round-button" 
          onClick={()=>this.alter({width: this.dataItem[0].width, height: this.dataItem[0].height})}
          aria-label="Make selected fields the same height and width as the first selected field."
            data-tooltip-id="le-tooltip" data-tooltip-content="Make selected fields the same height and width as the first selected field." data-tooltip-place="top">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8V4M4 4H8M4 4L8 8M20 8V4M20 4H16M20 4L16 8M4 16V20M4 20H8M4 20L8 16M20 16V20M20 20H16M20 20L16 16M8 8H10M8 8V10M16 8H14M16 8V10M8 16H10M8 16V14M16 16V14M16 16H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
