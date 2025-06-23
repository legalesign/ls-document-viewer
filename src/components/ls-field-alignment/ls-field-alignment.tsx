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

  right() {
    const rightmost = this.dataItem.reduce((rightmost, current) => {

      return (current.left + current.width) < rightmost ? rightmost : (current.left + current.width)
    }, 0);

    console.log(rightmost)

    const diffs: LSMutateEvent[] = this.dataItem.map((c) => {
      const newLeft = rightmost - c.width

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

  center() {
    const addcentres = this.dataItem.reduce((total, current) => {
      console.log(total + (current.left + current.width / 2))
      return total + (current.left + current.width / 2)
    }, 0);
    console.log(addcentres)

    const cp = addcentres / this.dataItem.length
    console.log('centerposition', cp)

    const diffs: LSMutateEvent[] = this.dataItem.map((c) => {

      const newLeft = c.left + (cp - (c.left + c.width / 2))
      return {
        action: "update", data: {
          ...c,
          left: newLeft,
          ax: newLeft,
          bx: newLeft + c.width
        } as LSApiElement
      }
    })
    console.log(diffs)
    this.dataItem = diffs.map(d => d.data)
    this.mutate.emit(diffs)
    this.update.emit(diffs)
  }

  top() {
    const topmost = this.dataItem.reduce((most, current) => {
      return current.top < most ? most : current.top
    }, 0);

    this.alter({ top: topmost })
  }

  middle() {
    const addmiddles = this.dataItem.reduce((total, current) => {
      console.log(total + (current.top + current.height / 2))
      return total + (current.top + current.height / 2)
    }, 0);

    const cp = addmiddles / this.dataItem.length

    const diffs: LSMutateEvent[] = this.dataItem.map((c) => {

      const newTop = c.top + (cp - (c.top + c.height / 2))
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

  bottom() {
    const lowest = this.dataItem.reduce((acc, current) => {
      return acc > (current.top + current.height) ? acc : (current.top + current.height)
    }, 0);

    const diffs: LSMutateEvent[] = this.dataItem.map((c) => {

      const newTop = lowest - c.height
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
        <div class="flex w-full gap-2 mt-2">
          <div class="flex rounded-[10px] focus:outline-hidden focus:ring-4 focus:ring-offset-0 focus:ring-primary-30 w-full">
            <button
              onClick={() => this.alter({ left: this.dataItem[0].left })}
              class='ls-round-button'
              aria-label="Align selected fields vertically about their left edge."
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Shift + Select multiple fields to access this control"
              data-tooltip-place="top"
            >
              <div class="font-ibm flex items-center w-5 h-5">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.97516 19.0459L1.97516 1.0459M18.9947 12.0005H6.99467C6.44239 12.0005 5.99467 12.4482 5.99467 13.0005L5.99467 15.0005C5.99467 15.5528 6.44239 16.0005 6.99467 16.0005H18.9947C19.547 16.0005 19.9947 15.5528 19.9947 15.0005V13.0005C19.9947 12.4482 19.547 12.0005 18.9947 12.0005ZM13.9947 3.99975L6.99467 3.99975C6.44239 3.99975 5.99467 4.44746 5.99467 4.99975L5.99467 6.99975C5.99467 7.55203 6.44239 7.99975 6.99467 7.99975L13.9947 7.99975C14.547 7.99975 14.9947 7.55203 14.9947 6.99975V4.99975C14.9947 4.44746 14.547 3.99975 13.9947 3.99975Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div></button>
            <button
              onClick={() => this.center()}
              class='ls-round-button'
              aria-label="Align selected fields vertically about their centre."
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Shift + Select multiple fields to access this control"
              data-tooltip-place="top"
            >
              <div class="font-ibm flex items-center w-5 h-5">
                <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.00781 12.0035L2.00781 12.0035C1.45553 12.0035 1.00781 12.4512 1.00781 13.0035V15.0035C1.00781 15.5558 1.45553 16.0035 2.00781 16.0035L5.00781 16.0035M11.0182 12.0035L14.0078 12.0035C14.5601 12.0035 15.0078 12.4512 15.0078 13.0035V15.0035C15.0078 15.5558 14.5601 16.0035 14.0078 16.0035H11.0182M5.01487 4.00472L4.01562 4.00475C3.46334 4.00475 3.01562 4.45247 3.01563 5.00475V7.00475C3.01563 7.55703 3.46334 8.00475 4.01563 8.00475L5.01487 8.00475M11.0116 4.00474L12.0156 4.00475C12.5679 4.00475 13.0156 4.45247 13.0156 5.00475L13.0156 7.00475C13.0156 7.55704 12.5679 8.00475 12.0156 8.00475H11.0116M8.00322 19.0459L8.00322 1.0459"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div></button>
            <button
              onClick={() => { this.right() }}
              aria-label="Align selected fields vertically about their right edge."
              class='ls-round-button'
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Shift + Select multiple fields to access this control"
              data-tooltip-place="top"
            >
              <div class="font-ibm flex items-center w-5 h-5">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.004 1.0459V10.0459V19.0459M14.004 16.0883H2.00403C1.45174 16.0883 1.00403 15.6406 1.00403 15.0883L1.00403 13.0883C1.00403 12.536 1.45174 12.0883 2.00403 12.0883H14.004C14.5563 12.0883 15.004 12.536 15.004 13.0883L15.004 15.0883C15.004 15.6406 14.5563 16.0883 14.004 16.0883ZM14.004 8.089L7.00403 8.089C6.45174 8.089 6.00403 7.64128 6.00403 7.089V5.089C6.00403 4.53671 6.45174 4.089 7.00403 4.089L14.004 4.089C14.5563 4.089 15.004 4.53671 15.004 5.089V7.089C15.004 7.64128 14.5563 8.089 14.004 8.089Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
          <div class="flex rounded-[10px] focus:outline-hidden focus:ring-4 focus:ring-offset-0 focus:ring-primary-30 w-full">
            <button
              onClick={() => this.top()}
              class='ls-round-button'
              aria-label="Align selected fields by their top."
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Shift + Select multiple fields to access this control"
              data-tooltip-place="top"
            >
              <div class="font-ibm flex items-center w-5 h-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.98492 3.03613L20.9849 3.03613M10.0303 20.0556V8.05565C10.0303 7.50336 9.58263 7.05565 9.03034 7.05565L7.03034 7.05565C6.47806 7.05565 6.03034 7.50336 6.03034 8.05565V20.0556C6.03034 20.6079 6.47806 21.0556 7.03034 21.0556H9.03034C9.58263 21.0556 10.0303 20.6079 10.0303 20.0556ZM18.0311 15.0556L18.0311 8.05565C18.0311 7.50336 17.5834 7.05565 17.0311 7.05565L15.0311 7.05565C14.4788 7.05565 14.0311 7.50336 14.0311 8.05565L14.0311 15.0556C14.0311 15.6079 14.4788 16.0556 15.0311 16.0556H17.0311C17.5834 16.0556 18.0311 15.6079 18.0311 15.0556Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
            </button>
            <button
              onClick={() => this.middle()}
              class='ls-round-button'
              aria-label="Align selected fields by their middles."
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Shift + Select multiple fields to access this control"
              data-tooltip-place="top"
            >
              <div class="font-ibm flex items-center w-5 h-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.0346 8.9541V5.9541C10.0346 5.40182 9.58684 4.9541 9.03456 4.9541H7.03456C6.48227 4.9541 6.03456 5.40182 6.03456 5.9541V8.9541M10.0346 14.9645V17.9541C10.0346 18.5064 9.58684 18.9541 9.03456 18.9541H7.03456C6.48227 18.9541 6.03456 18.5064 6.03456 17.9541V14.9645M18.0334 8.96116L18.0333 7.96191C18.0333 7.40963 17.5856 6.96191 17.0333 6.96191H15.0333C14.4811 6.96191 14.0333 7.40963 14.0333 7.96191L14.0333 8.96116M18.0333 14.9579L18.0333 15.9619C18.0333 16.5142 17.5856 16.9619 17.0333 16.9619H15.0333C14.4811 16.9619 14.0333 16.5142 14.0333 15.9619V14.9579M2.99219 11.9495L20.9922 11.9495"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div></button>
            <button
              onClick={() => this.bottom()}
              class='ls-round-button'
              aria-label="Align selected fields by their bottoms."
              data-tooltip-id="le-tooltip"
              data-tooltip-content="Shift + Select multiple fields to access this control"
              data-tooltip-place="top"
            >
              <div class="font-ibm flex items-center w-5 h-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21.004 21.0459H12.004H3.00403M5.96166 16.0459V4.0459C5.96166 3.49361 6.40938 3.0459 6.96166 3.0459L8.96166 3.0459C9.51395 3.0459 9.96166 3.49361 9.96166 4.0459V16.0459C9.96166 16.5982 9.51395 17.0459 8.96166 17.0459H6.96166C6.40938 17.0459 5.96166 16.5982 5.96166 16.0459ZM13.9609 16.0459L13.9609 9.0459C13.9609 8.49361 14.4086 8.0459 14.9609 8.0459H16.9609C17.5132 8.0459 17.9609 8.49361 17.9609 9.0459L17.9609 16.0459C17.9609 16.5982 17.5132 17.0459 16.9609 17.0459H14.9609C14.4086 17.0459 13.9609 16.5982 13.9609 16.0459Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <slot></slot>
      </Host>
    );
  }
}
