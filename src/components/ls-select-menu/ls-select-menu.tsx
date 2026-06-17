import { Component, Element, Prop, State, Event, EventEmitter, Listen, h } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-select-menu',
  styleUrl: 'ls-select-menu.scss',
  shadow: true,
})
export class LsSelectMenu {
  @Element() el: HTMLElement;

  @Prop() selected: any[] = [];
  @Prop() pageNum: number;
  @Prop() editor: any;

  @State() isOpen: boolean = false;

  @Event({ bubbles: true, composed: true }) selectFields: EventEmitter<any[]>;

  componentDidLoad() {
    ['mousedown', 'mouseup', 'mousemove', 'click', 'dblclick'].forEach(eventType => {
      this.el.addEventListener(eventType, e => {
        e.stopPropagation();
      });
    });
  }

  @Listen('click', { target: 'window' })
  handleWindowClick(event: MouseEvent) {
    if (this.isOpen && !this.el.shadowRoot.contains(event.composedPath()[0] as Node)) {
      this.isOpen = false;
    }
  }

  private get hasSelection(): boolean {
    return this.selected?.length > 0;
  }

  private getAllFields(): any[] {
    return Array.from(this.editor?.component?.shadowRoot?.querySelectorAll('ls-editor-field') || []);
  }

  private selectAll() {
    const fields = this.getAllFields();
    this.selectFields.emit(fields.map(f => f.dataItem));
    this.isOpen = false;
  }

  private selectAllOnPage() {
    const fields = this.getAllFields().filter(f => f.dataItem?.page === this.pageNum);
    this.selectFields.emit(fields.map(f => f.dataItem));
    this.isOpen = false;
  }

  private selectBySameParticipant() {
    if (!this.hasSelection) return;
    const signers = new Set(this.selected.map(f => f.dataItem?.signer));
    const fields = this.getAllFields().filter(f => signers.has(f.dataItem?.signer));
    this.selectFields.emit(fields.map(f => f.dataItem));
    this.isOpen = false;
  }

  private selectBySameType() {
    if (!this.hasSelection) return;
    const types = new Set(this.selected.map(f => f.dataItem?.formElementType));
    const fields = this.getAllFields().filter(f => types.has(f.dataItem?.formElementType));
    this.selectFields.emit(fields.map(f => f.dataItem));
    this.isOpen = false;
  }

  private selectBySameParticipantAndType() {
    if (!this.hasSelection) return;
    const keys = new Set(this.selected.map(f => `${f.dataItem?.signer}::${f.dataItem?.formElementType}`));
    const fields = this.getAllFields().filter(f => keys.has(`${f.dataItem?.signer}::${f.dataItem?.formElementType}`));
    this.selectFields.emit(fields.map(f => f.dataItem));
    this.isOpen = false;
  }

  render() {
    const disabledTooltip = dvI18n.t('selectmenu.disabledtooltip');

    return (
      <div class="ls-select-menu">
        <button class={{ 'ls-select-menu-trigger': true, 'ls-select-menu-trigger-expanded': this.isOpen }} onClick={() => (this.isOpen = !this.isOpen)}
        >
          <ls-icon name="cursor-click-icon" />
          <span class="ls-select-menu-trigger-text">{dvI18n.t('selectmenu.title')}</span>
        </button>
        {this.isOpen && (
          <div class="ls-select-menu-dropdown">
            <button class="ls-select-menu-item" onClick={() => this.selectAll()}>
              {dvI18n.t('selectmenu.selectall')}
            </button>
            <button class="ls-select-menu-item" onClick={() => this.selectAllOnPage()}>
              {dvI18n.t('selectmenu.selectallonpage')}
            </button>
            <div class="ls-select-menu-divider" />
            <button
              class={{ 'ls-select-menu-item': true, 'ls-select-menu-disabled': !this.hasSelection }}
              disabled={!this.hasSelection}
              onClick={() => this.selectBySameParticipant()}
              data-tooltip-id="ls-select-menu-tooltip"
              data-tooltip-content={!this.hasSelection ? disabledTooltip : null}
              data-tooltip-place="left"
            >
              {dvI18n.t('selectmenu.sameparticipant')}
            </button>
            <button
              class={{ 'ls-select-menu-item': true, 'ls-select-menu-disabled': !this.hasSelection }}
              disabled={!this.hasSelection}
              onClick={() => this.selectBySameType()}
              data-tooltip-id="ls-select-menu-tooltip"
              data-tooltip-content={!this.hasSelection ? disabledTooltip : null}
              data-tooltip-place="left"
            >
              {dvI18n.t('selectmenu.sametype')}
            </button>
            <button
              class={{ 'ls-select-menu-item': true, 'ls-select-menu-disabled': !this.hasSelection }}
              disabled={!this.hasSelection}
              onClick={() => this.selectBySameParticipantAndType()}
              data-tooltip-id="ls-select-menu-tooltip"
              data-tooltip-content={!this.hasSelection ? disabledTooltip : null}
              data-tooltip-place="left"
            >
              {dvI18n.t('selectmenu.sameparticipantandtype')}
            </button>
          </div>
        )}
        <ls-tooltip tooltipId="ls-select-menu-tooltip" />
      </div>
    );
  }
}
