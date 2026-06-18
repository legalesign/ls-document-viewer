import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LSApiElement, LSMutateEvent } from '../../components';
import { Element } from '@stencil/core';

@Component({
  tag: 'ls-field-dimensions',
  styleUrl: 'ls-field-dimensions.scss',
  shadow: true,
})
export class LsFieldDimensions {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement | LSApiElement[];
  @Prop() template: any; // LSApiTemplate
  @Prop() readonly: boolean = false;

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

  getMultiValue(key: string): number | undefined {
    if (!this.isMultiple(this.dataItem)) return undefined;
    const first = this.dataItem[0][key];
    return this.dataItem.every(item => item[key] === first) ? first : undefined;
  }

  getDataItem(): LSApiElement {
    if (this.isSingle(this.dataItem)) {
      return this.dataItem;
    }
    return this.dataItem[0];
  }

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff);
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

  componentDidLoad() {
  }

  render() {
    return (
      <Host>
        {this.isMultiple(this.dataItem) && (
          <div class={'ls-dv-field-properties-section'}>
            <div class={'ls-dv-field-properties-section-text'}>
              <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('dimensions.heightandwidth')}</p>
              <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('dimensions.heightandwidthdescription')}</p>
            </div>
            <div class={'ls-dv-input-row'}>
              <div class={'ls-dv-input-wrapper'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('dimensions.setwidthtooltip')}>
                <ls-icon id="selectLeadingIcon" name="field-match-width-icon"></ls-icon>
                <input
                  type="number"
                  class={'ls-dv-has-leading-icon'}
                  aria="field-width"
                  id="field-width"
                  value={this.getMultiValue('width')}
                  placeholder={this.getMultiValue('width') === undefined ? dvI18n.t('fieldproperties.mixed') : undefined}
                  onChange={e => this.alter({ width: parseInt((e.target as HTMLInputElement).value) })}
                  disabled={this.readonly}
                />
              </div>
              <div class={'ls-dv-input-wrapper'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('dimensions.setheighttooltip')}>
                <ls-icon id="selectLeadingIcon" name="field-match-height-icon"></ls-icon>
                <input
                  type="number"
                  class={'ls-dv-has-leading-icon'}
                  aria="field-height"
                  id="field-height"
                  value={this.getMultiValue('height')}
                  placeholder={this.getMultiValue('height') === undefined ? dvI18n.t('fieldproperties.mixed') : undefined}
                  onChange={e => this.alter({ height: parseInt((e.target as HTMLInputElement).value) })}
                  disabled={this.readonly}
                />
              </div>
            </div>

            {/* <div>
              Top: <input value={''} onChange={e => this.alter({ top: (e.target as HTMLInputElement).value })} width="30" />
            </div>
            <div>
              Left: <input value={''} onChange={e => this.alter({ left: (e.target as HTMLInputElement).value })} width="30" />
            </div> */}
          </div>
        )}
        {this.isSingle(this.dataItem) && (
          <div class={'ls-dv-field-set'}>
            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('dimensions.heightandwidth')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('dimensions.heightandwidthdescription')}</p>
              </div>
              <div class={'ls-dv-input-row'}>
                <div class={'ls-dv-input-wrapper'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('dimensions.setwidthtooltip')}>
                  <ls-icon id="selectLeadingIcon" name="field-match-width-icon"></ls-icon>
                  <input
                    type="number"
                    class={'ls-dv-has-leading-icon'}
                    aria="field-width"
                    id="field-width"
                    min={5}
                    max={this.dataItem.pageDimensions.width - this.dataItem.width}
                    value={this.dataItem?.width}
                    onChange={e => {
                      const di = this.getDataItem();
                      const newWidth = parseInt((e.target as HTMLInputElement).value);
                      if (newWidth > di.pageDimensions.width - di.left) {
                        return;
                      }
                      // If signature field with fixed scale, auto-adjust height
                      if (di.formElementType === 'signature' && this.template?.fixSignatureScale) {
                        const newHeight = Math.round(newWidth / 3.8);
                        this.alter({ width: newWidth, height: newHeight });
                      } else {
                        this.alter({ width: newWidth });
                      }
                    }}
                    disabled={this.readonly}
                  />
                </div>
                <div class={'ls-dv-input-wrapper'} data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('dimensions.setheighttooltip')}>
                  <ls-icon id="selectLeadingIcon" name="field-match-height-icon"></ls-icon>
                  <input
                    type="number"
                    class={'ls-dv-has-leading-icon'}
                    aria="field-height"
                    id="field-height"
                    value={this.dataItem?.height}
                    onChange={e => {
                      const di = this.getDataItem();
                      const newHeight = parseInt((e.target as HTMLInputElement).value);
                      if (newHeight > di.pageDimensions.height - di.top) {
                        return;
                      }
                      // If signature field with fixed scale, auto-adjust width
                      if (di.formElementType === 'signature' && this.template?.fixSignatureScale) {
                        const newWidth = Math.round(newHeight * 3.8);
                        this.alter({ height: newHeight, width: newWidth });
                      } else {
                        this.alter({ height: newHeight });
                      }
                    }}
                    disabled={this.readonly}
                  />
                </div>
              </div>
            </div>

            <div class={'ls-dv-field-properties-section'}>
              <div class={'ls-dv-field-properties-section-text'}>
                <p class={'ls-dv-field-properties-section-title'}>{dvI18n.t('dimensions.scaleandresize')}</p>
                <p class={'ls-dv-field-properties-section-description'}>{dvI18n.t('dimensions.scaleandresizedescription')}</p>
              </div>
              <div class={'ls-dv-button-group'}>
                <button disabled data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.selectmultiplescale')}>
                  <ls-icon name="field-scale-icon"></ls-icon>
                </button>
                <button disabled data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.selectmultiplewidth')}>
                  <ls-icon name="field-match-width-icon"></ls-icon>
                </button>
                <button disabled data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('alignment.selectmultipleheight')}>
                  <ls-icon name="field-match-height-icon"></ls-icon>
                </button>
              </div>
            </div>
          </div>
        )}
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
