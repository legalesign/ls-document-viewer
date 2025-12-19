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
  dataItem: LSApiElement | LSApiElement[];
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

  isSingle(dt: LSApiElement | LSApiElement[]): dt is LSApiElement {
    return (dt as LSApiElement[]).length === undefined;
  }

  isMultiple(dt: LSApiElement | LSApiElement[]): dt is LSApiElement[] {
    return typeof (dt as LSApiElement[]).length === 'number';
  }

  getItems(): LSApiElement[] {
    if (this.isSingle(this.dataItem)) {
      return [this.dataItem];
    }
    return this.dataItem;
  }

  deleteField = () => {
    this.mutate.emit(this.getItems().map(di => { return { action: 'delete', data: di } }));
  }

  duplicateField = () => {
    this.getItems().forEach(current => {
      const newItem = { ...current, id: btoa('ele' + crypto.randomUUID()) };
      const newTop = current.top + current.height;
      if (newTop + current.height < current.pageDimensions.height) {
        newItem.top = newTop;
      }
      this.mutate.emit([{ action: 'create', data: newItem, select: 'clear' }]);
    });
  }

  render() {
    return (
      <Host>
        <div class={'button-footer'}>
          <button class={'secondary'} onClick={() => this.duplicateField()}>
            <ls-icon name="field-duplicate" size="1.25rem" />
            Duplicate
          </button>
          <button class={'destructive'} onClick={() => this.deleteField()}>
            <ls-icon name="trash" size="1.25rem" color='var(--red-60)' />
            Delete
          </button>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
