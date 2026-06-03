import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-field-properties-advanced',
  styleUrl: 'ls-field-properties-advanced.scss',
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

  isSingle(dt: LSApiElement | LSApiElement[]): dt is LSApiElement {
    return (dt as LSApiElement[]).length === undefined;
  }

  isMultiple(dt: LSApiElement | LSApiElement[]): dt is LSApiElement[] {
    return typeof (dt as LSApiElement[]).length === 'number';
  }

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  // NOTE this alter is debounced to account for typing
  alter(diff: object, bounceDelay: number = 0) {
    console.log('Altering advanced props:', diff);
    let diffs = [];
    if (this.isMultiple(this.dataItem)) {
      this.dataItem = this.dataItem.map(di => {
        return { ...di, ...diff } as LSApiElement;
      });

      diffs = this.dataItem.map(di => {
        return { action: 'update', data: { ...di, ...diff } as LSApiElement } as LSMutateEvent;
      });
    } else if (this.isSingle(this.dataItem)) {
      this.dataItem = { ...this.dataItem, ...diff };

      diffs = [{ action: 'update', data: { ...this.dataItem, ...diff } }];
    }

    if (bounceDelay === 0) {
      this.mutate.emit(diffs);
    }
    else {
      this.debounce(diffs, bounceDelay);
    }
  }

  private titletimer;

  debounce(diffs, delay) {
    if (this.titletimer) clearTimeout(this.titletimer);

    this.titletimer = setTimeout(() => {
      this.mutate.emit(diffs);
    }, delay);
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
        <div class={'ls-dv-expand-fields-row'} onClick={() => (this.expanded = !this.expanded)}>
          <ls-icon name={this.expanded ? 'expand-icon' : 'collapse-icon'} size={20} solid />
          <p>{dvI18n.t('fieldproperties.advancedproperties')}</p>
        </div>
        {this.expanded && (
          <div class={'ls-dv-field-set'}>
            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.fieldorder')} sectionDescription={dvI18n.t('fieldproperties.fieldorderdescription')}>
              <input value={this.getValue('fieldOrder')} type="number" placeholder={dvI18n.t('fieldproperties.placeholdereg1')} onInput={e => {
                console.log(e);
                this.alter({ fieldOrder: (e.target as HTMLInputElement).value }, 100)
              }} 
              onChange={() => { console.log('onchange')}}
              />
            </ls-props-section>

            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.refname')}>
              <input value={this.getValue('link')} placeholder={dvI18n.t('fieldproperties.placeholdercheckboxgroup')} onInput={e => this.alter({ link: (e.target as HTMLInputElement).value }, 300)} />
            </ls-props-section>

            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.linktype')} sectionDescription={dvI18n.t('fieldproperties.linktypedescription')}>
              <select onChange={e => this.alter({ linkType: (e.target as HTMLInputElement).value })} name="Link Field" aria-label="Link Field">
                <option value="0" selected={this.getValue('linkType') === '0'}>
                  {dvI18n.t('fieldproperties.linktypenoption')}
                </option>
                <option value="1" selected={this.getValue('linkType') === '1'}>
                  {dvI18n.t('fieldproperties.linktypeoneofgroup')}
                </option>
                <option value="2" selected={this.getValue('linkType') === '2'}>
                  {dvI18n.t('fieldproperties.linktypeaddtotal')}
                </option>
                <option value="3" selected={this.getValue('linkType') === '3'}>
                  {dvI18n.t('fieldproperties.linktypeconditional')}
                </option>
              </select>
            </ls-props-section>

            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.linkvalue')} sectionDescription={dvI18n.t('fieldproperties.linkvaluedescription')}>
              <input
                value={this.getValue('logicAction')}
                width="30"
                placeholder={dvI18n.t('fieldproperties.placeholdercheckboxgroup')}
                onChange={e => this.alter({ logicAction: (e.target as HTMLInputElement).value })}
              />
            </ls-props-section>
          </div>
        )}
      </Host>
    );
  }
}
