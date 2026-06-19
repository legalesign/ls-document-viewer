import { Component, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { LSApiElement, LSApiTemplate, LsDocumentViewer, LSMutateEvent } from '../../components';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-toolbar',
  styleUrl: 'ls-toolbar.scss',
  shadow: true,
})
export class LsToolbar {
  @Element() component: HTMLElement;

  /**
   * The selected items information (as JSON).
   * {LSApiElement[]}
   */
  @Prop({
    mutable: true,
  })
  dataItem: LSApiElement[];

  /**
   * The group and experience information.
   * {object}
   */
  @Prop() groupInfo: object;

  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop() template: LSApiTemplate;

  /**
   * The main editor.
   * {LSDocumentViewer}
   */
  @Prop({
    mutable: true,
  })
  editor: LsDocumentViewer;

  @Prop() mode: string;

  @Prop() signer: number;

  @Prop() selected: any[];

  @Prop() pageNum: number;

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

  // @Element() component: HTMLElement;

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  componentDidLoad() {
    ['mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'click', 'dblclick', 'contextmenu'].forEach(eventType => {
      this.component.addEventListener(eventType, e => {
        e.stopPropagation();
      });
    });
  }

  private renderEditor() {
    return (
      <div class="ls-dv-toolbar">
        {this.dataItem && this.dataItem.length > 1 ? (
          <div class="rowbox">
            <ls-field-format dataItem={this.dataItem} />
          </div>
        ) : (
          <div class="rowbox">
            <ls-field-format dataItem={this.dataItem} />
            <ls-participant-select
              id="ls-participant-select"
              roles={this.template?.roles}
              signer={this.signer}
              style={{ display: this.dataItem && this.dataItem.length === 1 ? 'none' : 'block' }}
            />
            <ls-tooltip tooltipId="ls-dv-tooltip" />
          </div>
        )}

        <slot></slot>
      </div>
    );
  }

  private renderCompose() {
    return (
      <div class={this.dataItem && this.dataItem.length > 0 ? 'ls-dv-toolbar' : ''}>
        <div class="rowbox">
          <ls-field-format dataItem={this.dataItem} />
          <ls-tooltip tooltipId="ls-dv-tooltip" />
        </div>

        <slot></slot>
      </div>
    );
  }

  private renderSelectionBanner() {
    if (!this.selected || this.selected.length === 0) return null;

    const pageNum = this.pageNum;
    const onThisPage = this.selected.filter(f => f.dataItem?.page === pageNum).length;
    const onOtherPages = this.selected.length - onThisPage;

    if (onOtherPages === 0) return null;

    return (
      <div class="ls-dv-selection-banner">
        <ls-icon style={{ marginRight: '0.125rem' }} name="target-icon" size={16} />
        <span>
          <span style={{ fontWeight: '500' }}>{dvI18n.t('toolbar.fieldsselectedcount', { total: this.selected.length })}</span>{' '}
          {dvI18n.t('toolbar.fieldsselecteddetail', { thispage: onThisPage, otherpages: onOtherPages })}
        </span>
        <button
          class="ls-dv-selection-banner-close"
          onClick={() => this.editor.unselect()}
          data-tooltip-id="ls-dv-selection-tooltip"
          data-tooltip-content={dvI18n.t('toolbar.deselectall')}
          data-tooltip-place="bottom"
        >
          <ls-icon name="x-icon" size={16} />
        </button>
        <ls-tooltip tooltipId="ls-dv-selection-tooltip" />
      </div>
    );
  }

  private renderLockedBanner() {
    return (
      <div class="ls-dv-locked-banner">
        <div class="ls-dv-locked-banner-icon">
          <ls-icon name="lock-closed-icon" size={20} />
        </div>
        <div class="ls-dv-locked-banner-text">
          <span class="ls-dv-locked-banner-title">{dvI18n.t('toolbar.templatelocked')}</span>
          <span class="ls-dv-locked-banner-subtitle">{dvI18n.t('toolbar.editingdisabled')}</span>
        </div>
        <button class="ls-dv-locked-banner-unlock" onClick={() => this.mutate.emit([{ action: 'update', data: { ...this.template, locked: false } }])}>
          {dvI18n.t('toolbar.unlock')}
        </button>
      </div>
    );
  }

  render() {
    if (this.template?.locked) {
      return this.renderLockedBanner();
    }
    return [this.mode === 'editor' ? this.renderEditor() : this.mode === 'compose' ? this.renderCompose() : null, this.renderSelectionBanner()];
  }
}
