import { Component, EventEmitter, Host, Prop, h, Element, Event } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-format',
  styleUrl: 'ls-field-format.css',
  shadow: true,
})
export class LsFieldFormat {
  @Prop({
    mutable: true,
  })
  dataItem: LSApiElement[];

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
  @Element() component: HTMLElement;

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
  render() {
    return (
      <Host>
        {this.dataItem && this.dataItem.length > 1 && (
          <div class={'ls-field-format-bar'}>
            <div class=" input-wrapper">
              <ls-icon id="selectLeadingIcon" name="typeface"></ls-icon>
              <select
                onChange={input => {
                  this.alter({ fontName: (input.target as HTMLSelectElement).value });
                }}
                class={'has-leading-icon'}
              >
                <option value="arial">Arial</option>
                <option value="liberation sans">Liberation Sans</option>
                <option value="courier">Courier</option>
                <option value="helvetica">Helvetica</option>
                <option value="verdana">Verdana</option>
              </select>
              <ls-icon id="selectorIcon" name="selector"></ls-icon>
            </div>
            <div class="input-wrapper">
              <ls-icon id="selectLeadingIcon" name="typesize"></ls-icon>
              <input width="30" size={4} class={'has-leading-icon'} />
            </div>
            <div class={'button-group'}>
              <button
                onClick={() => {
                  this.alter({ align: 'left' });
                }}
              >
                <ls-icon name="menu-alt-2"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.alter({ align: 'center' });
                }}
              >
                <ls-icon name="menu-alt-5"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.alter({ align: 'right' });
                }}
              >
                <ls-icon name="menu-alt-3"></ls-icon>
              </button>
            </div>
          </div>
        )}
        {this.dataItem && this.dataItem.length === 1 && (
          <div class={'ls-field-format-bar'}>
            <div class="input-wrapper">
              <ls-icon id="selectorIcon" name="selector"></ls-icon>
              <ls-icon id="selectLeadingIcon" name="typeface"></ls-icon>
              <select
                onChange={input => {
                  this.alter({ fontName: (input.target as HTMLSelectElement).value });
                }}
                class={'has-leading-icon'}
              >
                <option value="arial">Arial</option>
                <option value="liberation sans">Liberation Sans</option>
                <option value="courier">Courier</option>
                <option value="helvetica">Helvetica</option>
                <option value="verdana">Verdana</option>
              </select>
            </div>
            <div class="input-wrapper">
              <ls-icon id="selectLeadingIcon" name="typesize"></ls-icon>
              <input
                width="30"
                size={4}
                value={this.dataItem[0].fontSize}
                onChange={input => {
                  this.alter({ fontSize: (input.target as HTMLInputElement).value });
                }}
                class={'has-leading-icon'}
              />
            </div>
            <div class={'button-group'}>
              <button
                onClick={() => {
                  this.alter({ align: 'left' });
                }}
              >
                <ls-icon name="menu-alt-2"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.alter({ align: 'center' });
                }}
              >
                <ls-icon name="menu-alt-5"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.alter({ align: 'right' });
                }}
              >
                <ls-icon name="menu-alt-3"></ls-icon>
              </button>
            </div>

            {/* <select
              onChange={input => {
                this.alter({ align: (input.target as HTMLSelectElement).value });
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select> */}
          </div>
        )}
      </Host>
    );
  }
}
