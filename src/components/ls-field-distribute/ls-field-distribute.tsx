import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-distribute',
  styleUrl: 'ls-field-distribute.css',
  shadow: true,
})
export class LsFieldDistribute {
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


  distributeHorizontal(fixed?: number) {

    var space = 0
    const sorted = this.dataItem.sort((a, b) => (a.left - b.left))
    for (var i = 1; i < sorted.length; i++) {
      const c1 = sorted[i - 1]
      const c2 = sorted[i]
      space = space + (((c2.left - c1.left - c1.width)) <= 0 ? 0 : (c2.left - c1.left - c1.width))
    }
    const avgspace = Math.floor(space / sorted.length)

    var nextleft = sorted[0].left

    const diffs: LSMutateEvent[] = sorted.map((c) => {
      const newLeft = nextleft
      nextleft = nextleft + c.width + (fixed ? fixed : avgspace)

      return {
        action: "update", data: {
          ...c,
          left: newLeft,
          ax: newLeft,
          bx: newLeft + c.width
        } as LSApiElement
      }
    })

    this.dataItem = diffs.map(d => d.data)
    this.mutate.emit(diffs)
    this.update.emit(diffs)
  }


  distributeVertical(fixed?: number) {

    var space = 0
    const sorted = this.dataItem.sort((a, b) => (a.top - b.top))
    for (var i = 1; i < sorted.length; i++) {
      const c1 = sorted[i - 1]
      const c2 = sorted[i]
      space = space + (((c2.top - c1.top - c1.height)) <= 0 ? 0 : (c2.top - c1.top - c1.height))
    }
    const avgspace = Math.floor(space / sorted.length)

    var buffer = sorted[0].top

    const diffs: LSMutateEvent[] = sorted.map((c) => {
      const newTop = buffer
      buffer = buffer + c.width + (fixed ? fixed : avgspace)

      return {
        action: "update", data: {
          ...c,
          top: newTop,
          ay: newTop,
          by: newTop + c.height
        } as LSApiElement
      }
    })

    this.dataItem = diffs.map(d => d.data)
    this.mutate.emit(diffs)
    this.update.emit(diffs)
  }

  render() {
    return (
      <Host>
        <div class="flex rounded-[10px] focus:outline-hidden focus:ring-4 focus:ring-offset-0 focus:ring-primary-30">
          <button
            class='ls-round-button'
            onClick={() => { this.distributeHorizontal() }}
            aria-label="Distribute selected fields horizontally."
            data-tooltip-id="le-tooltip" data-tooltip-content="Distribute selected fields horizontally."
            data-tooltip-place="top">
            <div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0004 5.00424H8.99963M15.0004 5.00424L15 6.99736M15.0004 5.00424L14.9996 3.00171M8.99963 5.00424V6.99736M8.99963 5.00424V3.00171M7.99963 20.9983H5.99963C5.44735 20.9983 4.99963 20.5495 4.99963 19.9959V11.9983C4.99963 11.4447 5.44735 10.9959 5.99963 10.9959H7.99963C8.55192 10.9959 8.99963 11.4447 8.99963 11.9983V19.9959C8.99963 20.5495 8.55192 20.9983 7.99963 20.9983ZM18.0004 20.9983H16.0004C15.4481 20.9983 15.0004 20.5495 15.0004 19.9959L14.9996 11.9983C14.9996 11.4447 15.4473 10.9959 15.9996 10.9959H17.9996C18.5519 10.9959 18.9996 11.4447 18.9996 11.9983L19.0004 19.9959C19.0004 20.5495 18.5526 20.9983 18.0004 20.9983Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></button>
          <button
            onClick={() => { this.distributeVertical() }}
            class='ls-round-button'
            aria-label="Distribute selected fields vertically."
            data-tooltip-id="le-tooltip" data-tooltip-content="Distribute selected fields vertically." data-tooltip-place="top">
            <div >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.00595 8.99927V15M5.00595 8.99927L6.99907 8.99963M5.00595 8.99927L3.00342 9M5.00595 15H6.99907M5.00595 15H3.00342M19.9977 15C20.5512 15 21 15.4477 21 16V18C21 18.5523 20.5512 19 19.9977 19H12C11.4464 19 10.9977 18.5523 10.9977 18V16C10.9977 15.4477 11.4464 15 12 15H19.9977ZM19.9977 4.99927C20.5512 4.99927 21 5.44698 21 5.99927V7.99927C21 8.55155 20.5512 8.99927 19.9977 8.99927L12 9C11.4464 9 10.9977 8.55228 10.9977 8V6C10.9977 5.44771 11.4464 5 12 5L19.9977 4.99927Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></button></div>
        <slot></slot>
      </Host>
    );
  }
}
