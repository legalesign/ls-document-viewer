import { Component, Host, Prop, h, Event, EventEmitter, State } from '@stencil/core';
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
  @Prop() readonly: boolean = false;

  private static readonly STORAGE_KEY = 'ls-field-properties-advanced-expanded';

  @State() expanded: boolean = localStorage.getItem(LsFieldPropertiesAdvanced.STORAGE_KEY) !== 'true';

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

    if (!bounceDelay || bounceDelay === 0) {
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
        <div class={'ls-dv-expand-fields-row'} onClick={() => { this.expanded = !this.expanded; localStorage.setItem(LsFieldPropertiesAdvanced.STORAGE_KEY, String(this.expanded)); }}>
          <ls-icon name={this.expanded ? 'expand-icon' : 'collapse-icon'} size={20} solid />
          <p>{dvI18n.t('fieldproperties.advancedproperties')}</p>
        </div>
        {this.expanded && (
          <div class={'ls-dv-field-set'}>
            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.fieldorder')} sectionDescription={dvI18n.t('fieldproperties.fieldorderdescription')}>
              <input type="number" placeholder={dvI18n.t('fieldproperties.placeholdereg1')} value={this.getValue('fieldOrder')} onInput={e => {
                console.log(e);
                this.alter({ fieldOrder: (e.target as HTMLInputElement).value }, 1500)
              }} 
              onChange={() => { console.log('onchange')}}
              disabled={this.readonly}
              />
            </ls-props-section>

            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.refname')}>
              <input value={this.getValue('mapTo')} placeholder={dvI18n.t('fieldproperties.placeholdercheckboxgroup')} onInput={e => this.alter({ mapTo: (e.target as HTMLInputElement).value }, 1500)} disabled={this.readonly} />
            </ls-props-section>

            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.linktype')} sectionDescription={dvI18n.t('fieldproperties.linktypedescription')}>
              <select onChange={e => this.alter({ logicAction: (e.target as HTMLInputElement).value }, 1500)} name="Link Field" aria-label="Link Field" disabled={this.readonly}>
                <option value="0" selected={this.getValue('logicAction') === 0 || this.getValue('logicAction') === "0"}>
                  {dvI18n.t('fieldproperties.linktypenoption')}
                </option>
                <option value="1" selected={this.getValue('logicAction') === 1 || this.getValue('logicAction') === "1" }>
                  {dvI18n.t('fieldproperties.linktypeoneofgroup')}
                </option>
                <option value="2" selected={this.getValue('logicAction') === 2 || this.getValue('logicAction') === "2" }>
                  {dvI18n.t('fieldproperties.linktypeaddtotal')}
                </option>
                <option value="3" selected={this.getValue('logicAction') === 3 || this.getValue('logicAction') === "3" }>
                  {dvI18n.t('fieldproperties.linktypeconditional')}
                </option>
              </select>
            </ls-props-section>

            <ls-props-section sectionTitle={dvI18n.t('fieldproperties.linkvalue')} sectionDescription={dvI18n.t('fieldproperties.linkvaluedescription')}>
              <input
                value={this.getValue('logicGroup')}
                width="30"
                placeholder={dvI18n.t('fieldproperties.placeholdercheckboxgroup')}
                onInput={e => this.alter({ logicGroup: (e.target as HTMLInputElement).value }, 350)}
                disabled={this.readonly}
              />
            </ls-props-section>

             <ls-props-section sectionTitle={dvI18n.t('fieldproperties.excludefrompdf')} row={true} sectionDescription={dvI18n.t('fieldproperties.excludefrompdfdescription')}>              
              <ls-toggle id="toggle-excludefrompdf" checked={this.getValue('excludeFromPdf')} onValueChange={ev => !this.readonly && this.alter({ excludeFromPdf: ev.detail })} />
            </ls-props-section>
          </div>
        )}
      </Host>
    );
  }
}
