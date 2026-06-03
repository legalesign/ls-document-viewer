import { Component, Host, Prop, State, h, Element } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';
import { attachAllTooltips } from '../../utils/tooltip';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { version } from '../../../package.json';

@Component({
  tag: 'ls-statusbar',
  styleUrl: 'ls-statusbar.scss',
  shadow: true,
})
export class LsStatusbar {
  @Element() component: HTMLElement;
  /**
   * The zoom or scale level 100 === 100%.
   * {number}
   */
  @Prop({ mutable: true }) zoom: number;
  @Prop({ mutable: true }) page: number;
  @Prop({ mutable: true }) pageCount: number;

  @State() showThumbnails: boolean = false;

  /**
   * The parent editor control.
   * {LsDocumentViewer}
   */
  @Prop() editor: LsDocumentViewer;

  setZoom(value: number) {
    this.editor.setZoom(value);
    this.zoom = value;
  }

  fitWidth() {
    const leftBox = this.editor.component.shadowRoot.getElementById('ls-left-box');
    const midBox = this.editor.component.shadowRoot.getElementById('document-frame-wrapper');
    const space = midBox.clientWidth - leftBox.clientWidth - 60; // 60 for padding/margin

    console.log('Space width:', space, 'Page width:', this.editor.pageDimensions[0].width);
    const scale: number = space / this.editor.pageDimensions[0].width;
    this.setZoom(Math.round(scale * 1e2) / 1e2);
  }

  fitHeight() {
    const space = window.screen.height - 40; // 40 for padding/margin
    const scale: number = space / this.editor.pageDimensions[0].height;
    this.setZoom(Math.round(scale * 1e2) / 1e2);
  }

  goToPage(pageNum: number) {
    const diff = pageNum - this.editor.pageNum;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) this.editor.pageNext();
    } else {
      for (let i = 0; i < Math.abs(diff); i++) this.editor.pagePrev();
    }
    this.page = pageNum;
    this.renderThumbnails();
  }

  getPageFieldColors(pageNum: number): { s40: string; s60: string }[] {
    const template = (this.editor as any)._template;
    if (!template?.elementConnection?.templateElements) return [];
    const signers = new Set<number>();
    template.elementConnection.templateElements.filter(el => el.page === pageNum).forEach(el => signers.add(el.signer));
    return Array.from(signers).map(s => ({
      s40: defaultRolePalette[s]?.s40 || defaultRolePalette[0].s40,
      s60: defaultRolePalette[s]?.s60 || defaultRolePalette[0].s60,
    }));
  }

  renderThumbnails() {
    const pdfDoc = (this.editor as any).pdfDocument;
    if (!pdfDoc) return;
    const container = this.component.shadowRoot.getElementById('ls-thumbnail-container');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 1; i <= this.pageCount; i++) {
      pdfDoc.getPage(i).then(page => {
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.className = i === this.page ? 'ls-dv-thumbnail active' : 'ls-dv-thumbnail';
        canvas.addEventListener('click', () => this.goToPage(i));
        const ctx = canvas.getContext('2d');
        page.render({ canvasContext: ctx, viewport });

        const wrapper = document.createElement('div');
        wrapper.className = 'ls-dv-thumbnail-wrapper';
        wrapper.addEventListener('click', () => this.goToPage(i));

        const dots = document.createElement('div');
        dots.className = 'ls-dv-thumbnail-dots';
        this.getPageFieldColors(i).forEach(color => {
          const dot = document.createElement('span');
          dot.className = 'ls-dv-thumbnail-dot';
          dot.style.setProperty('--dot-color-40', color.s40);
          dot.style.setProperty('--dot-color-60', color.s60);
          dots.appendChild(dot);
        });

        const label = document.createElement('span');
        label.textContent = `${i}`;
        wrapper.appendChild(canvas);
        wrapper.appendChild(dots);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
      });
    }
  }

  private outsideClickHandler = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this.component)) {
      this.showThumbnails = false;
      document.removeEventListener('click', this.outsideClickHandler);
    }
  };

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
    this.zoom = this.editor.zoom;
  }

  render() {
    return (
      <Host>
        <div class={'ls-dv-controls-bar'}>
          {/* <button onClick={() => this.editor.displayTable = true}><ls-icon name="table-icon" /></button>
        <button onClick={() => this.editor.displayTable = false}><ls-icon name="template-icon" /></button> */}
          <div class={'ls-dv-status-bar-section'}>
            <button onClick={() => this.setZoom(this.editor.zoom * 0.8)} id="zoom-out-btn" data-tooltip={dvI18n.t('statusbar.zoomout')}>
              <ls-icon name="zoom-out-icon" />
            </button>
            <span>{Math.round(this.zoom * 100)}%</span>
            <button onClick={() => this.setZoom(this.editor.zoom / 0.8)} id="zoom-in-btn" data-tooltip={dvI18n.t('statusbar.zoomin')}>
              <ls-icon name="zoom-in-icon" />
            </button>
          </div>
          <div class={'ls-dv-status-bar-section'}>
            <button onClick={() => this.fitWidth()} id="fit-width-btn" data-tooltip={dvI18n.t('statusbar.fitwidth')}>
              <ls-icon name="fit-width-icon" />
            </button>
            <button onClick={() => this.fitHeight()} id="fit-height-btn" data-tooltip={dvI18n.t('statusbar.fitheight')}>
              <ls-icon name="fit-height-icon" />
            </button>
          </div>
          <div class={'ls-dv-status-bar-section'} style={this.pageCount === 1 && { display: 'none' }}>
            <button
              onClick={() => {
                this.editor.pagePrev();
              }}
              disabled={this.page === 1}
              id="prev-page-btn"
              data-tooltip={this.page === 1 ? dvI18n.t('statusbar.nopreviouspage') : dvI18n.t('statusbar.previouspage')}
            >
              <ls-icon name="chevron-left-icon" />
            </button>
            <p>
              {this.page} / {this.pageCount}
            </p>
            <button
              onClick={() => {
                this.editor.pageNext();
              }}
              disabled={this.page === this.pageCount}
              id="next-page-btn"
              data-tooltip={this.page === this.pageCount ? dvI18n.t('statusbar.nonextpage') : dvI18n.t('statusbar.nextpage')}
            >
              <ls-icon name="chevron-right-icon" />
            </button>
          </div>
          <div class={'ls-dv-status-bar-section'} style={this.pageCount === 1 ? { display: 'none' } : {}}>
            <button
              onClick={() => {
                this.showThumbnails = !this.showThumbnails;
                if (this.showThumbnails) {
                  setTimeout(() => this.renderThumbnails(), 0);
                  setTimeout(() => document.addEventListener('click', this.outsideClickHandler), 0);
                } else {
                  document.removeEventListener('click', this.outsideClickHandler);
                }
              }}
              id="page-thumbnails-btn"
              data-tooltip={dvI18n.t('statusbar.pagethumbnails')}
            >
              <ls-icon name={!this.showThumbnails ? 'side-panel-open-right-icon' : 'side-panel-close-right-icon'} />
            </button>
          </div>
          {this.showThumbnails && (
            <div class="ls-dv-thumbnail-popover">
              <div id="ls-thumbnail-container" class="ls-dv-thumbnail-grid"></div>
            </div>
          )}
        </div>
        <ls-helper-bar />
        <span class="ls-dv-version">v{version}</span>
        <ls-dv-tooltip id="ls-tooltip-master" />
        <slot></slot>
      </Host>
    );
  }
}
