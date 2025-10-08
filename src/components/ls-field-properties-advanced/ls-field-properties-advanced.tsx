import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';

@Component({
  tag: 'ls-field-properties-advanced',
  styleUrl: 'ls-field-properties-advanced.css',
  shadow: true,
})
export class LsFieldPropertiesAdvanced {
  @Prop({ mutable: true }) dataItem: LSApiElement | LSApiElement[];
  @Prop({ mutable: true }) expanded: boolean = false;

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

  isSingle(dt: LSApiElement | LSApiElement[]): dt is LSApiElement {
    return (dt as LSApiElement[]).length === undefined;
  }

  isMultiple(dt: LSApiElement | LSApiElement[]): dt is LSApiElement[] {
    return typeof (dt as LSApiElement[]).length === 'number';
  }

  alter(diff: object) {
    let diffs = [];
    if (this.isMultiple(this.dataItem)) {
      this.dataItem = this.dataItem.map(di => {
        return { ...di, ...diff } as LSApiElement;
      });

      diffs = this.dataItem.map(di => {
        return { action: 'update', data: { ...di, ...diff } as LSApiElement } as LSMutateEvent;
      });
    } else if (this.isMultiple(this.dataItem)) {
      this.dataItem = { ...this.dataItem, ...diff };

      diffs = [{ action: 'update', data: { ...this.dataItem, ...diff } }];
    }
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  getValue(key) {
    if (this.isMultiple(this.dataItem)) {
      return '';
    } else if (this.isSingle(this.dataItem)) {
      return this.dataItem[key];
    }
    return '';
  }

  render() {
    return (
      <Host>
        <div class={'expand-fields-row'} onClick={() => (this.expanded = !this.expanded)}>
          <ls-icon name={this.expanded ? 'expand' : 'collapse'} size="20" solid />
          <p>Advanced Properties</p>
        </div>
        {this.expanded && (
          <div class={'field-set'}>
            <ls-props-section sectionTitle="Field Order" sectionDescription="Determines what order fields will be filled in by the user">
              <input value={this.getValue('fieldOrder')} type="text" placeholder="eg. 1" onChange={e => this.alter({ fieldOrder: (e.target as HTMLInputElement).value })} />
            </ls-props-section>

            <ls-props-section sectionTitle="Ref. Name">
              <input value={this.getValue('link')} placeholder="eg. checkbox group" onChange={e => this.alter({ link: (e.target as HTMLInputElement).value })} />
            </ls-props-section>

            <ls-props-section sectionTitle="Link Type" sectionDescription="Determines  in what way this field is linked to other fields">
              <select onChange={e => this.alter({ linkType: (e.target as HTMLInputElement).value })} name="Link Field" aria-label="Link Field">
                <option value="0" selected={this.getValue('linkType') === '0'}>
                  None
                </option>
                <option value="1" selected={this.getValue('linkType') === '1'}>
                  One of a group (e.g. select one checkbox)
                </option>
                <option value="2" selected={this.getValue('linkType') === '2'}>
                  Add to a total
                </option>
                <option value="3" selected={this.getValue('linkType') === '3'}>
                  Make this conditional upon...
                </option>
              </select>
            </ls-props-section>

            <ls-props-section sectionTitle="Link Value" sectionDescription="Fields with the same Link Value will be linked together">
              <input
                value={this.getValue('logicAction')}
                width="30"
                placeholder="eg. checkbox group"
                onChange={e => this.alter({ logicAction: (e.target as HTMLInputElement).value })}
              />
            </ls-props-section>
          </div>
        )}
      </Host>
    );
  }
}
