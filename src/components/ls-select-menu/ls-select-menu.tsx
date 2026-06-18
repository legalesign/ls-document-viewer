import { Component, Element, Prop, State, Event, EventEmitter, Listen, Watch, h } from '@stencil/core';
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
  @Prop() floating: boolean = false;

  @State() isOpen: boolean = false;
  @State() isVisible: boolean = false;
  @State() isHeldDown: boolean = false;
  @State() floatingTop: number = 0;
  @State() floatingLeft: number = 0;

  private scrollHandler: () => void;
  private frameMouseDownHandler: () => void;
  private frameMouseUpHandler: () => void;
  private frameKeyDownHandler: (e: KeyboardEvent) => void;
  private frameKeyUpHandler: (e: KeyboardEvent) => void;

  @Event({ bubbles: true, composed: true }) selectFields: EventEmitter<any[]>;

  componentDidLoad() {
    ['mousedown', 'mouseup', 'mousemove', 'click', 'dblclick'].forEach(eventType => {
      this.el.addEventListener(eventType, e => {
        e.stopPropagation();
      });
    });

    if (this.floating) {
      this.scrollHandler = () => this.updateFloatingVisibility();
      const wrapper = this.editor?.component?.shadowRoot?.getElementById('document-frame-wrapper');
      if (wrapper) wrapper.addEventListener('scroll', this.scrollHandler);

      const frame = this.editor?.component?.shadowRoot?.getElementById('ls-document-frame');
      if (frame) {
        this.frameMouseDownHandler = () => { this.isHeldDown = true; };
        this.frameMouseUpHandler = () => { this.isHeldDown = false; this.updateFloatingVisibility(); };
        frame.addEventListener('mousedown', this.frameMouseDownHandler);
        frame.addEventListener('mouseup', this.frameMouseUpHandler);
      }

      const arrowKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
      this.frameKeyDownHandler = (e: KeyboardEvent) => {
        if (arrowKeys.has(e.key)) this.isHeldDown = true;
      };
      this.frameKeyUpHandler = (e: KeyboardEvent) => {
        if (arrowKeys.has(e.key)) { this.isHeldDown = false; this.updateFloatingVisibility(); }
      };
      document.addEventListener('keydown', this.frameKeyDownHandler);
      document.addEventListener('keyup', this.frameKeyUpHandler);
    }
  }

  disconnectedCallback() {
    if (this.floating) {
      const wrapper = this.editor?.component?.shadowRoot?.getElementById('document-frame-wrapper');
      if (wrapper && this.scrollHandler) wrapper.removeEventListener('scroll', this.scrollHandler);
      const frame = this.editor?.component?.shadowRoot?.getElementById('ls-document-frame');
      if (frame) {
        if (this.frameMouseDownHandler) frame.removeEventListener('mousedown', this.frameMouseDownHandler);
        if (this.frameMouseUpHandler) frame.removeEventListener('mouseup', this.frameMouseUpHandler);
      }
      if (this.frameKeyDownHandler) document.removeEventListener('keydown', this.frameKeyDownHandler);
      if (this.frameKeyUpHandler) document.removeEventListener('keyup', this.frameKeyUpHandler);
    }
  }

  @Watch('selected')
  @Watch('pageNum')
  onSelectionChange() {
    if (this.floating) {
      this.updateFloatingVisibility();
    }
  }

  private updateFloatingVisibility() {
    if (!this.floating || !this.editor) {
      this.isVisible = false;
      return;
    }

    const pageSelected = this.selected?.filter(f => f.dataItem?.page === this.pageNum);
    if (!pageSelected || pageSelected.length === 0) {
      this.isVisible = false;
      return;
    }

    // Check if main select menu button is out of view
    const mainMenu = this.editor.component?.shadowRoot?.querySelector('.ls-dv-select-menu-position') as HTMLElement;
    if (!mainMenu) {
      this.isVisible = false;
      return;
    }

    const wrapper = this.editor.component?.shadowRoot?.getElementById('document-frame-wrapper');
    if (!wrapper) {
      this.isVisible = false;
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const mainRect = mainMenu.getBoundingClientRect();
    const mainInView = mainRect.top >= wrapperRect.top && mainRect.bottom <= wrapperRect.bottom &&
                       mainRect.left >= wrapperRect.left && mainRect.right <= wrapperRect.right;

    if (mainInView) {
      this.isVisible = false;
      return;
    }

    // Calculate position: top-right of selection bounds using getBoundingClientRect for accuracy
    const frame = this.editor.component?.shadowRoot?.getElementById('ls-document-frame');
    if (!frame) {
      this.isVisible = false;
      return;
    }
    const frameRect = frame.getBoundingClientRect();

    let maxRight = -Infinity;
    let minTop = Infinity;
    pageSelected.forEach(f => {
      const rect = f.getBoundingClientRect();
      const right = rect.right - frameRect.left;
      const top = rect.top - frameRect.top;
      if (right > maxRight) maxRight = right;
      if (top < minTop) minTop = top;
    });

    this.floatingTop = minTop + frame.scrollTop;
    this.floatingLeft = maxRight + frame.scrollLeft + 8;
    this.isVisible = true;
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
    if (this.floating && (!this.isVisible || this.isHeldDown)) return null;

    const disabledTooltip = dvI18n.t('selectmenu.disabledtooltip');

    if (this.floating) {
      this.el.style.position = 'absolute';
      this.el.style.top = this.floatingTop + 'px';
      this.el.style.left = this.floatingLeft + 'px';
    }

    return (
      <div class="ls-select-menu">
        <button class={{ 'ls-select-menu-trigger': true, 'ls-select-menu-trigger-expanded': this.isOpen }} onClick={() => (this.isOpen = !this.isOpen)}
        >
          <ls-icon name="cursor-click-icon" />
          <span class="ls-select-menu-trigger-text">{this.floating ? dvI18n.t('selectmenu.titlefloating') : dvI18n.t('selectmenu.title')}</span>
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
