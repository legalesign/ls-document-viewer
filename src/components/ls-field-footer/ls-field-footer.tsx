import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-footer',
  styleUrl: 'ls-field-footer.css',
  shadow: true,
})
export class LsFieldFooter {
  /**
   * The selected items information (as JSON).
   * {LSApiElement[]}
   */
  @Prop({
    mutable: true,
  })
  dataItem: LSApiElement;
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

   @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  selectFields: EventEmitter<LSApiElement[]>;

  deleteField = () => {
    this.update.emit([{ action: 'delete', data: this.dataItem }]);
    this.mutate.emit([{ action: 'delete', data: this.dataItem }]);
  }

  duplicateField = () => {
    const newItem = { ...this.dataItem, id: btoa('ele' + crypto.randomUUID()) };
    const newTop = this.dataItem.top + this.dataItem.height;
    if(newTop + this.dataItem.height < this.dataItem.pageDimensions.height) {
      newItem.top = newTop;
    }
    this.update.emit([{ action: 'create', data: newItem, select: 'clear' }]);
    this.mutate.emit([{ action: 'create', data: newItem }]);
    // this.selectFields.emit([newItem]);
  }

  render() {
    return (
      <Host>
        <div class={'button-footer'}>
          <button class={'secondary'} onClick={() => this.duplicateField()}>
            <ls-icon name="field-duplicate" size="20" />
            Duplicate
          </button>
          <button class={'destructive'} onClick={() => this.deleteField()}>
            <ls-icon name="trash" size="20" />
            Delete
          </button>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
