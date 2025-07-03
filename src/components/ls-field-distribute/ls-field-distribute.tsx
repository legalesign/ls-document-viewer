import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
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
  @Element() component: HTMLElement;


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


  distributeHorizontal() {
    var spacing = this.component.shadowRoot.getElementById('ls-fix-horizontal-space') as HTMLInputElement;
    var avgspace = 0;
    const sorted = this.dataItem.sort((a, b) => (a.left - b.left))

    if(spacing.value !== "") {
      avgspace = parseInt(spacing.value)
    } else {
      var space = 0
      for (var i = 1; i < sorted.length; i++) {
        const c1 = sorted[i - 1]
        const c2 = sorted[i]
        space = space + (((c2.left - c1.left - c1.width)) <= 0 ? 0 : (c2.left - c1.left - c1.width))
      }
      avgspace = Math.floor(space / sorted.length)
    }

    var nextleft = sorted[0].left

    const diffs: LSMutateEvent[] = sorted.map((c) => {
      const newLeft = nextleft
      nextleft = nextleft + c.width + avgspace

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


  distributeVertical() {
    var spacing = this.component.shadowRoot.getElementById('ls-fix-vertical-space') as HTMLInputElement;
    var avgspace = 0;
    const sorted = this.dataItem.sort((a, b) => (a.top - b.top))

    if (spacing.value !== '') avgspace = parseInt(spacing.value)
    else {
      var space = 0
      for (var i = 1; i < sorted.length; i++) {
        const c1 = sorted[i - 1]
        const c2 = sorted[i]
        space = space + (((c2.top - c1.top - c1.height)) <= 0 ? 0 : (c2.top - c1.top - c1.height))
      }
      avgspace = Math.floor(space / sorted.length)

    }

    var buffer = sorted[0].top

    const diffs: LSMutateEvent[] = sorted.map((c) => {
      const newTop = buffer
      buffer = buffer + c.height + avgspace

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
            <ls-icon name="field-distribute-horizontally" /></button>

          <input type="number" class="ls-toolbar-numeric" id="ls-fix-horizontal-space" value={""} size={4} min={0}  max={9999} />
          <button
            onClick={() => { this.distributeVertical() }}
            class='ls-round-button'
            aria-label="Distribute selected fields vertically."
            data-tooltip-id="le-tooltip" data-tooltip-content="Distribute selected fields vertically." data-tooltip-place="top">
            <ls-icon name="field-distribute-vertically" />
          </button>
          <input type="number" class="ls-toolbar-numeric" id="ls-fix-vertical-space" value={""} size={4} min={0} max={9999}/>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
