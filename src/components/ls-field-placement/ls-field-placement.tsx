import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';

@Component({
  tag: 'ls-field-placement',
  styleUrl: 'ls-field-placement.scss',
  shadow: true,
})
export class LsFieldPlacement {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement | LSApiElement[];
  @Prop() readonly: boolean = false;

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

  getMultiValue(key: string): number | undefined {
    if (!this.isMultiple(this.dataItem)) return undefined;
    const first = this.dataItem[0][key];
    return this.dataItem.every(item => item[key] === first) ? first : undefined;
  }

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    if (this.isMultiple(this.dataItem)) {
      const diffs: LSMutateEvent[] = this.dataItem.map(c => {
        return { action: 'update', data: { ...c, ...diff } as LSApiElement };
      });

      this.dataItem = diffs.map(d => d.data as LSApiElement);
      this.mutate.emit(diffs);
    } else {
      const singleDiff = { action: 'update', data: { ...this.dataItem, ...diff } as LSApiElement } as LSMutateEvent;
      this.dataItem = singleDiff.data as LSApiElement;
      this.mutate.emit([singleDiff]);
    }
  }

  center() {
    const item = this.dataItem as LSApiElement;
    return item.pageDimensions.width / 2 - item.width / 2;
  }

  right() {
    const item = this.dataItem as LSApiElement;
    return item.pageDimensions.width - item.width;
  }

  middle() {
    const item = this.dataItem as LSApiElement;
    return item.pageDimensions.height / 2 - item.height / 2;
  }

  bottom() {
    const item = this.dataItem as LSApiElement;
    return item.pageDimensions.height - item.height;
  }

  componentDidLoad() {
  }

  render() {
    return (
      <Host>
        {this.isMultiple(this.dataItem) && (
          <div class={'ls-dv-field-properties-section'}>
            <div class={'ls-dv-field-properties-section-text'}>
              <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.location')}</p>
              <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.locationdescription')}</p>
            </div>
            <div class={'ls-dv-input-row'}>
              <div class={'ls-dv-input-wrapper'}>
                <ls-icon id="selectLeadingIcon" name="x-letter-icon"></ls-icon>
                <input
                  type="number"
                  class={'ls-dv-has-leading-icon'}
                  aria="top-location"
                  id="top-location"
                  value={this.getMultiValue('left')}
                  placeholder={this.getMultiValue('left') === undefined ? dvI18n.t('fieldproperties.mixed') : undefined}
                  onChange={e => this.alter({ left: parseInt((e.target as HTMLInputElement).value) })}
                  disabled={this.readonly}
                />
              </div>
              <div class={'ls-dv-input-wrapper'}>
                <ls-icon id="selectLeadingIcon" name="y-icon"></ls-icon>
                <input
                  type="number"
                  class={'ls-dv-has-leading-icon'}
                  aria="left-location"
                  id="left-location"
                  value={this.getMultiValue('top')}
                  placeholder={this.getMultiValue('top') === undefined ? dvI18n.t('fieldproperties.mixed') : undefined}
                  onChange={e => this.alter({ top: parseInt((e.target as HTMLInputElement).value) })}
                  disabled={this.readonly}
                />
              </div>
            </div>
          </div>
        )}
        {this.isSingle(this.dataItem) && (
          <div class={'ls-dv-field-set'}>
            {/* @Alex I couldn't get this to work?? Only Top and Left */}

            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.alignment')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.alignmentdescription')}</p>
              </div>
              <div class={'ls-dv-multi-button-group-row'}>
                <div class={'ls-dv-button-group'}>
                  <button onClick={() => { this.alter({ left: 0 }) }} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.alignleft')} disabled={this.readonly}>
                    <ls-icon name="field-alignment-left-icon"></ls-icon>
                  </button>
                  <button onClick={() => { this.alter({ left: this.center() }) }} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.aligncenter')} disabled={this.readonly}>
                    <ls-icon name="field-alignment-centre-icon"></ls-icon>
                  </button>
                  <button onClick={() => { this.alter({ left: this.right() }) }} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.alignright')} disabled={this.readonly}>
                    <ls-icon name="field-alignment-right-icon"></ls-icon>
                  </button>
                </div>
                <div class={'ls-dv-button-group'}>
                  <button onClick={() => this.alter({ top: 0 })} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.aligntop')} disabled={this.readonly}>
                    <ls-icon name="field-alignment-top-icon"></ls-icon>
                  </button>
                  <button onClick={() => { this.alter({ top: this.middle() }) }} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.alignmiddle')} disabled={this.readonly}>
                    <ls-icon name="field-alignment-middle-icon"></ls-icon>
                  </button>
                  <button onClick={() => { this.alter({ top: this.bottom() }) }} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.alignbottom')} disabled={this.readonly}>
                    <ls-icon name="field-alignment-bottom-icon"></ls-icon>
                  </button>
                </div>
              </div>
            </div>

            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.location')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.locationdescription')}</p>
              </div>
              <div class={'ls-dv-input-row'}>
                <div class={'ls-dv-input-wrapper'}>
                  <ls-icon id="selectLeadingIcon" name="x-letter-icon"></ls-icon>
                  <input
                    type="number"
                    class={'ls-dv-has-leading-icon'}
                    aria="top-location"
                    id="top-location"
                    value={this.dataItem?.left}
                    onChange={e => this.alter({ left: parseInt((e.target as HTMLInputElement).value) })}
                    disabled={this.readonly}
                  />
                </div>
                <div class={'ls-dv-input-wrapper'}>
                  <ls-icon id="selectLeadingIcon" name="y-icon"></ls-icon>
                  <input
                    type="number"
                    class={'ls-dv-has-leading-icon'}
                    aria="left-location"
                    id="left-location"
                    value={this.dataItem?.top}
                    onChange={e => this.alter({ top: parseInt((e.target as HTMLInputElement).value) })}
                    width="30"
                    disabled={this.readonly}
                  />
                </div>
              </div>
            </div>

            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.distribution')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.distributiondescription')}</p>
              </div>
              <div class={'ls-dv-button-group'}>
                <button disabled data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.selectmultipledistribution')}>
                  <ls-icon name="field-distribute-vertically-icon"></ls-icon>
                </button>
                <button disabled data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.selectmultipledistribution')}>
                  <ls-icon name="field-distribute-horizontally-icon"></ls-icon>
                </button>
              </div>
            </div>

            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('placement.gap')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('placement.gapdescription')}</p>
              </div>
              <div class={'ls-dv-input-row'}>
                <div class={'ls-dv-input-wrapper'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('placement.selectmultiplegap')}>
                  <ls-icon id="selectLeadingIconDisabled" name="field-distribute-vertically-icon"></ls-icon>
                  <input type="number" value="0" class={'ls-dv-has-leading-icon'} aria="vertical-gap" id="vertical-gap" disabled />
                </div>
                <div class={'ls-dv-input-wrapper'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('placement.selectmultiplegap')}>
                  <ls-icon id="selectLeadingIconDisabled" name="field-distribute-horizontally-icon"></ls-icon>
                  <input type="number" value="0" class={'ls-dv-has-leading-icon'} aria="horizontal-gap" id="horizontal-gap" disabled />
                </div>
              </div>
            </div>
          </div>
        )}
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
