import { Component, EventEmitter, Host, Prop, h, Element, Event, Watch } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LSApiElement, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-field-format',
  styleUrl: 'ls-field-format.scss',
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

  @Element() component: HTMLElement;

  private handleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    event.stopPropagation();
  };

  // Send selection changes to bars and panels if in use.
  @Watch('dataItem')
  selectFieldsHandler() {
    if (this.dataItem.length > 0) {
      var selFont = this.component.shadowRoot.getElementById('ls-toolbar-font-select') as HTMLSelectElement;
      if (selFont) selFont.value = this.allElementsSame()?.fontName;
      var selFontSize = this.component.shadowRoot.getElementById('ls-toolbar-font-size') as HTMLInputElement;
      if (selFontSize) selFontSize.value = this.allElementsSame()?.fontSize.toString();
    }
  }

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    console.log(diff);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  componentDidLoad() {
  }

  allElementsSame = () => {
    if (!this.dataItem || this.dataItem.length === 0) return;
    const firstFontName = this.dataItem[0].fontName;
    const allFontsSame = this.dataItem.every(item => item.fontName === firstFontName);
    const firstFontSize = this.dataItem[0].fontSize;
    const allFontSizesSame = this.dataItem.every(item => item.fontSize === firstFontSize);
    return { isSame: allFontsSame && allFontSizesSame, fontName: allFontsSame ? firstFontName : 'mixed', fontSize: allFontSizesSame ? firstFontSize : 'mixed' };
  };

  render() {
    return (
      <Host onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
        {this.dataItem && this.dataItem.length > 1 && (
          <div class={'ls-dv-field-format-bar'}>
            <div class="ls-dv-input-wrapper" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.fontfamily')}>
              <ls-icon id="selectLeadingIcon" name="typeface-icon"></ls-icon>
              <select
                id="ls-toolbar-font-select"
                onChange={input => {
                  this.alter({ fontName: (input.target as HTMLSelectElement).value });
                }}
                class={'ls-dv-has-leading-icon'}
              >
                <option disabled selected={this.allElementsSame()?.fontName === 'mixed'} value={'mixed'}>
                  Mixed
                </option>
                <option value="arial">Arial</option>
                <option value="liberation sans">Liberation Sans</option>
                <option value="courier">Courier</option>
                <option value="helvetica">Helvetica</option>
                <option value="verdana">Verdana</option>
              </select>
              <ls-icon id="selectorIcon" name="selector-icon"></ls-icon>
            </div>
            <div class="ls-dv-input-wrapper" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.fontsize')}>
              <ls-icon id="selectLeadingIcon" name="text-size-icon"></ls-icon>
              <input
                id="ls-toolbar-font-size"
                type='number'
                min="4"
                value={this.allElementsSame()?.fontSize}
                onChange={input => {
                  if ((input.target as HTMLInputElement).value === '') return;
                  this.alter({ fontSize: (input.target as HTMLInputElement).value });
                }}
                class={'ls-dv-has-leading-icon'}
              />
            </div>
            <div class={'ls-dv-button-group'}>
              <button
                onClick={() => {
                  this.alter({ align: 'left' });
                }}
                data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.aligntextleft')}
              >
                <ls-icon name="menu-alt-2-icon"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.alter({ align: 'center' });
                }}
                data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.aligntextcenter')}
              >
                <ls-icon name="menu-alt-5-icon"></ls-icon>
              </button>
              <button
                onClick={() => {
                  this.alter({ align: 'right' });
                }}
                data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.aligntextright')}
              >
                <ls-icon name="menu-alt-3-icon"></ls-icon>
              </button>
            </div>
          </div>
        )}
        {this.dataItem && this.dataItem.length === 1 && (
          <div class={'ls-dv-field-format-bar'}>
            <div class="ls-dv-input-wrapper" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.fontfamily')}>
              <ls-icon id="selectorIcon" name="selector-icon"></ls-icon>
              <ls-icon id="selectLeadingIcon" name="typeface-icon"></ls-icon>
              <select
                id="ls-toolbar-font-select"
                onChange={input => {
                  this.alter({ fontName: (input.target as HTMLSelectElement).value });
                }}
                class={'ls-dv-has-leading-icon'}
              >
                <option value="arial">Arial</option>
                <option value="liberation sans">Liberation Sans</option>
                <option value="courier">Courier</option>
                <option value="helvetica">Helvetica</option>
                <option value="verdana">Verdana</option>
              </select>
            </div>
            <div class="ls-dv-input-wrapper" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.fontsize')}>
              <ls-icon id="selectLeadingIcon" name="text-size-icon"></ls-icon>
              <input
                id="ls-toolbar-font-size"
                type="number"
                min="4"
                size={4}
                value={this.dataItem[0].fontSize}
                onChange={input => {
                  if ((input.target as HTMLInputElement).value === '') return;
                  this.alter({ fontSize: (input.target as HTMLInputElement).value });
                }}
                class={'ls-dv-has-leading-icon'}
              />
            </div>
            <div class={'ls-dv-button-group'}>
              <button
                class={{ 'ls-dv-active': this.dataItem[0].align === 'left' || !this.dataItem[0].align }}
                onClick={() => {
                  this.alter({ align: 'left' });
                }}
                data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.aligntextleft')}
              >
                <ls-icon name="menu-alt-2-icon"></ls-icon>
              </button>
              <button
                class={{ 'ls-dv-active': this.dataItem[0].align === 'center' }}
                onClick={() => {
                  this.alter({ align: 'center' });
                }}
                data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.aligntextcenter')}
              >
                <ls-icon name="menu-alt-5-icon"></ls-icon>
              </button>
              <button
                class={{ 'ls-dv-active': this.dataItem[0].align === 'right' }}
                onClick={() => {
                  this.alter({ align: 'right' });
                }}
                data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('format.aligntextright')}
              >
                <ls-icon name="menu-alt-3-icon"></ls-icon>
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
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
