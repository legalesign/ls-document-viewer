import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-alignment',
  styleUrl: 'ls-field-alignment.css',
  shadow: true,
})
export class LsFieldAlignment {
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
    console.log(diff);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  right() {
    const rightmost = this.dataItem.reduce((rightmost, current) => {
      return current.left + current.width < rightmost ? rightmost : current.left + current.width;
    }, 0);

    console.log(rightmost);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newLeft = rightmost - c.width;

      return {
        action: 'update',
        data: {
          ...c,
          left: newLeft,
          ax: newLeft,
          bx: newLeft + c.width,
        } as LSApiElement,
      };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  center() {
    const addcentres = this.dataItem.reduce((total, current) => {
      console.log(total + (current.left + current.width / 2));
      return total + (current.left + current.width / 2);
    }, 0);
    console.log(addcentres);

    const cp = addcentres / this.dataItem.length;
    console.log('centerposition', cp);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newLeft = c.left + (cp - (c.left + c.width / 2));
      return {
        action: 'update',
        data: {
          ...c,
          left: newLeft,
          ax: newLeft,
          bx: newLeft + c.width,
        } as LSApiElement,
      };
    });
    console.log(diffs);
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  top() {
    const topmost = this.dataItem.reduce((most, current) => {
      return current.top < most ? most : current.top;
    }, 0);

    this.alter({ top: topmost });
  }

  left() {
    const leftmost = this.dataItem.reduce((least, current) => {
      return current.left < least ? current.left : least;
    }, this.dataItem[0].left);

    this.alter({ left: leftmost });
  }

  middle() {
    const addmiddles = this.dataItem.reduce((total, current) => {
      console.log(total + (current.top + current.height / 2));
      return total + (current.top + current.height / 2);
    }, 0);

    const cp = addmiddles / this.dataItem.length;

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newTop = c.top + (cp - (c.top + c.height / 2));
      return {
        action: 'update',
        data: {
          ...c,
          top: newTop,
          ay: newTop,
          by: newTop + c.height,
        } as LSApiElement,
      };
    });
    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  bottom() {
    const lowest = this.dataItem.reduce((acc, current) => {
      return acc > current.top + current.height ? acc : current.top + current.height;
    }, 0);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      const newTop = lowest - c.height;
      return {
        action: 'update',
        data: {
          ...c,
          top: newTop,
          ay: newTop,
          by: newTop + c.height,
        } as LSApiElement,
      };
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
            <p class={'ls-field-properties-section-title'}>Alignment</p>
            <p class={'ls-field-properties-section-description'}>Align your Fields relative to the page or multi-select and align then to each other.</p>
          </div>
          <div class={'multi-button-group-row'}>
            <div class={'button-group'}>
              <button
                onClick={() => this.left()}
                aria-label="Align selected fields vertically about their left edge."
                data-tooltip-id="le-tooltip"
                data-tooltip-content="Shift + Select multiple fields to access this control"
                data-tooltip-place="top"
              >
                <ls-icon name="field-alignment-left"></ls-icon>
              </button>
              <button
                onClick={() => this.center()}
                aria-label="Align selected fields vertically about their centre."
                data-tooltip-id="le-tooltip"
                data-tooltip-content="Shift + Select multiple fields to access this control"
                data-tooltip-place="top"
              >
                <ls-icon name="field-alignment-centre"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.right();
                }}
                aria-label="Align selected fields vertically about their right edge."
                data-tooltip-id="le-tooltip"
                data-tooltip-content="Shift + Select multiple fields to access this control"
                data-tooltip-place="top"
              >
                <ls-icon name="field-alignment-right"></ls-icon>
              </button>
            </div>
            <div class={'button-group'}>
              <button
                onClick={() => this.top()}
                aria-label="Align selected fields by their top."
                data-tooltip-id="le-tooltip"
                data-tooltip-content="Shift + Select multiple fields to access this control"
                data-tooltip-place="top"
              >
                <ls-icon name="field-alignment-top"></ls-icon>
              </button>
              <button
                onClick={() => this.middle()}
                aria-label="Align selected fields by their middles."
                data-tooltip-id="le-tooltip"
                data-tooltip-content="Shift + Select multiple fields to access this control"
                data-tooltip-place="top"
              >
                <ls-icon name="field-alignment-middle"></ls-icon>
              </button>
              <button
                onClick={() => this.bottom()}
                aria-label="Align selected fields by their bottoms."
                data-tooltip-id="le-tooltip"
                data-tooltip-content="Shift + Select multiple fields to access this control"
                data-tooltip-place="top"
              >
                <ls-icon name="field-alignment-bottom"></ls-icon>
              </button>
            </div>
          </div>
        </div>

        <slot></slot>
      </Host>
    );
  }
}
