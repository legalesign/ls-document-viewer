import { Component, Host, Prop, State, Watch, h, Element } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { version } from '../../../package.json';
import { undo, redo } from '../ls-document-viewer/history';

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
  @State() showZoomMenu: boolean = false;
  @State() showPageMenu: boolean = false;

  /**
   * The parent editor control.
   * {LsDocumentViewer}
   */
  @Prop() editor: LsDocumentViewer;

  /**
   * The viewer mode.
   * {'preview' | 'editor' | 'compose'}
   */
  @Prop() mode: 'preview' | 'editor' | 'compose' = 'editor';

  setZoom(value: number) {
    this.editor.setZoom(value);
    this.zoom = value;
  }

  fitWidth() {
    const wrapper = this.editor.component.shadowRoot.getElementById('document-frame-wrapper');
    const scale = (wrapper.clientWidth - 396) / this.editor.pageDimensions[this.editor.pageNum - 1].width;
    this.setZoom(Math.round(scale * 1e2) / 1e2);
    requestAnimationFrame(() => wrapper.scrollTo(0, 0));
  }

  fitHeight() {
    const midArea = this.editor.component.shadowRoot.getElementById('ls-mid-area');
    const wrapper = this.editor.component.shadowRoot.getElementById('document-frame-wrapper');
    const wrapperStyle = getComputedStyle(wrapper);
    const paddingY = parseFloat(wrapperStyle.paddingTop) + parseFloat(wrapperStyle.paddingBottom);
    const availableHeight = midArea.clientHeight - paddingY;
    const scale = availableHeight / this.editor.pageDimensions[this.editor.pageNum - 1].height;
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

  getPageFieldColors(pageNum: number): { s40: string; s60: string; s70: string; name: string; count: number }[] {
    const template = (this.editor as any)._template;
    if (!template?.elementConnection?.templateElements) return [];
    const fields = template.elementConnection.templateElements.filter(el => el.page === pageNum);
    const signerCounts = new Map<number, number>();
    fields.forEach(el => signerCounts.set(el.signer, (signerCounts.get(el.signer) || 0) + 1));
    return Array.from(signerCounts.entries())
      .sort(([a], [b]) => {
        const baseA = a % 100;
        const baseB = b % 100;
        if (baseA !== baseB) return baseA - baseB;
        return a - b;
      })
      .map(([s, count]) => {
        const role = template.roles?.find(r => r.signerIndex === s);
        const colorIndex = s % 100;
        return {
          s40: defaultRolePalette[colorIndex]?.s40 || defaultRolePalette[0].s40,
          s60: defaultRolePalette[colorIndex]?.s60 || defaultRolePalette[0].s60,
          s70: defaultRolePalette[colorIndex]?.s70 || defaultRolePalette[0].s70,
          name: role?.name || `Participant ${s}`,
          count,
        };
      });
  }

  getPageFields(pageNum: number) {
    const template = (this.editor as any)._template;
    if (!template?.elementConnection?.templateElements) return [];
    return template.elementConnection.templateElements.filter(el => el.page === pageNum);
  }

  renderFieldsOnCanvas(ctx: CanvasRenderingContext2D, pageNum: number, viewport: { width: number; height: number }) {
    const fields = this.getPageFields(pageNum);
    fields.forEach(field => {
      const colorIndex = field.signer % 100;
      const palette = defaultRolePalette[colorIndex] || defaultRolePalette[0];
      const x = field.ax * viewport.width;
      const y = field.ay * viewport.height;
      const w = (field.bx - field.ax) * viewport.width;
      const h = (field.by - field.ay) * viewport.height;

      ctx.fillStyle = palette.s40 + '1a';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = palette.s60;
      ctx.lineWidth = 1;
      if (field.signer >= 100) {
        ctx.setLineDash([2, 2]);
      }
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    });
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

        const wrapper = document.createElement('div');
        wrapper.className = 'ls-dv-thumbnail-wrapper';
        wrapper.addEventListener('click', () => this.goToPage(i));

        const dots = document.createElement('div');
        dots.className = 'ls-dv-thumbnail-dots';
        this.getPageFieldColors(i).forEach(color => {
          const dot = document.createElement('span');
          dot.className = 'ls-dv-thumbnail-dot';
          dot.setAttribute('data-tooltip-id', 'ls-dv-tooltip');
          dot.setAttribute('data-tooltip-content', `${color.name}, ${color.count} Field${color.count !== 1 ? 's' : ''}`);
          dot.style.setProperty('--dot-color-40', color.s40);
          dot.style.setProperty('--dot-color-60', color.s60);
          dot.style.setProperty('--dot-color-70', color.s70);
          dots.appendChild(dot);
        });

        const label = document.createElement('span');
        label.textContent = `${i}`;
        wrapper.appendChild(canvas);
        wrapper.appendChild(dots);
        wrapper.appendChild(label);
        container.appendChild(wrapper);

        // Render after appending to DOM — Safari requires the canvas to be
        // in the visible tree before getContext/render produces output.
        const ctx = canvas.getContext('2d');
        page.render({ canvasContext: ctx, viewport }).promise.then(() => {
          this.renderFieldsOnCanvas(ctx, i, viewport);
          // Force Safari to composit the canvas by toggling a style property
          canvas.style.opacity = '0.99';
          requestAnimationFrame(() => {
            canvas.style.opacity = '1';
          });
        });
      });
    }
  }

  private outsideClickHandler = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this.component)) {
      this.showThumbnails = false;
      this.showZoomMenu = false;
      this.showPageMenu = false;
      document.removeEventListener('click', this.outsideClickHandler);
    }
  };

  private zoomMenuClickHandler = (e: MouseEvent) => {
    const path = e.composedPath();
    const menu = this.component.shadowRoot.getElementById('ls-zoom-menu');
    const btn = this.component.shadowRoot.getElementById('zoom-level-btn');
    if (!path.includes(menu) && !path.includes(btn)) {
      this.showZoomMenu = false;
      document.removeEventListener('click', this.zoomMenuClickHandler, true);
    }
  };

  private pageMenuClickHandler = (e: MouseEvent) => {
    const path = e.composedPath();
    const menu = this.component.shadowRoot.getElementById('ls-page-menu');
    const btn = this.component.shadowRoot.getElementById('page-level-btn');
    if (!path.includes(menu) && !path.includes(btn)) {
      this.showPageMenu = false;
      document.removeEventListener('click', this.pageMenuClickHandler, true);
    }
  };

  private applyUndo() {
    const mutations = undo();
    if (!mutations) return;
    this.editor._skipHistory = true;
    this.editor.mutate.emit(mutations);
  }

  private applyRedo() {
    const mutations = redo();
    if (!mutations) return;
    this.editor._skipHistory = true;
    this.editor.mutate.emit(mutations);
  }

  componentDidLoad() {
    this.zoom = this.editor.zoom;
  }

  @Watch('page')
  onPageChange() {
    if (this.showThumbnails) {
      this.renderThumbnails();
      requestAnimationFrame(() => {
        const container = this.component.shadowRoot.getElementById('ls-thumbnail-container');
        const wrapper = container?.querySelector('.ls-dv-thumbnail.active')?.closest('.ls-dv-thumbnail-wrapper') as HTMLElement;
        if (wrapper && container) {
          const gap = 12; // 0.75rem
          const wrapperTop = wrapper.offsetTop - container.offsetTop;
          const wrapperBottom = wrapperTop + wrapper.offsetHeight;
          const scrollTop = container.scrollTop;
          const viewHeight = container.clientHeight;

          if (wrapperTop - gap < scrollTop) {
            container.scrollTo({ top: wrapperTop - gap, behavior: 'smooth' });
          } else if (wrapperBottom + gap > scrollTop + viewHeight) {
            container.scrollTo({ top: wrapperBottom + gap - viewHeight, behavior: 'smooth' });
          }
        }
      });
    }
  }

  render() {
    const isPreview = this.mode === 'preview';
    return (
      <Host class={{ 'ls-dv-statusbar-preview': isPreview }}>
        {!isPreview && (
          <div class={'ls-dv-controls-bar'}>
            <div class={'ls-dv-status-bar-section'}>
              <button onClick={() => this.applyUndo()} id="undo-btn" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('statusbar.undo')} >
                <ls-icon name="undo-icon" size={18} />
              </button>
              <button onClick={() => this.applyRedo()} id="redo-btn" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('statusbar.redo')} >
                <ls-icon name="redo-icon" style={{transform: "scale(-1, 1)", marginLeft: '0.25rem'}} size={18} />
              </button>
            </div>
          </div>
        )}
        <div class={{'ls-dv-controls-bar': true, 'ls-dv-page-nav': true}}>
          <div class={'ls-dv-status-bar-section'} style={this.pageCount === 1 && { display: 'none' }}>
            <button
              onClick={() => {
                this.editor.pagePrev();
              }}
              disabled={this.page === 1}
              id="prev-page-btn"
              data-tooltip-id="ls-dv-tooltip"
              data-tooltip-content={this.page === 1 ? dvI18n.t('statusbar.nopreviouspage') : dvI18n.t('statusbar.previouspage')}
            >
              <ls-icon name="chevron-left-icon" />
            </button>
            <button
              id="page-level-btn"
              class="ls-dv-zoom-level-btn"
              onClick={() => {
                this.showPageMenu = !this.showPageMenu;
                if (this.showPageMenu) {
                  requestAnimationFrame(() => document.addEventListener('click', this.pageMenuClickHandler, true));
                } else {
                  document.removeEventListener('click', this.pageMenuClickHandler, true);
                }
              }}
            >
              {this.page} / {this.pageCount}
            </button>
            {this.showPageMenu && (
              <div id="ls-page-menu" class="ls-dv-zoom-menu ls-dv-page-menu" >
                {Array.from({ length: this.pageCount }, (_, i) => i + 1).map(p => (
                  <button
                    class={{ 'ls-dv-zoom-menu-item': true, 'active': this.page === p }}
                    onClick={() => {
                      this.goToPage(p);
                      this.showPageMenu = false;
                      document.removeEventListener('click', this.pageMenuClickHandler, true);
                    }}
                  >
                    {p}
                    {this.page === p && <ls-icon name="check-icon" size={14} />}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                this.editor.pageNext();
              }}
              disabled={this.page === this.pageCount}
              id="next-page-btn"
              data-tooltip-id="ls-dv-tooltip"
              data-tooltip-content={this.page === this.pageCount ? dvI18n.t('statusbar.nonextpage') : dvI18n.t('statusbar.nextpage')}
            >
              <ls-icon name="chevron-right-icon" />
            </button>
          </div>
        </div>
        <div class={'ls-dv-status-bar-group'}>
          <div class={'ls-dv-controls-bar'} style={{position: 'relative'}}>
            {/* <button onClick={() => this.editor.displayTable = true}><ls-icon name="table-icon" /></button>
        <button onClick={() => this.editor.displayTable = false}><ls-icon name="template-icon" /></button> */}
            <div class={'ls-dv-status-bar-section'}>
              <button onClick={() => this.setZoom(this.editor.zoom * 0.8)} id="zoom-out-btn" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('statusbar.zoomout')}>
                <ls-icon name="zoom-out-icon" />
              </button>
              <button
                id="zoom-level-btn"
                class="ls-dv-zoom-level-btn"
                onClick={() => {
                  this.showZoomMenu = !this.showZoomMenu;
                  if (this.showZoomMenu) {
                    requestAnimationFrame(() => document.addEventListener('click', this.zoomMenuClickHandler, true));
                  } else {
                    document.removeEventListener('click', this.zoomMenuClickHandler, true);
                  }
                }}
              >
                {Math.round(this.zoom * 100)}%
              </button>
              {this.showZoomMenu && (
                <div id="ls-zoom-menu" class="ls-dv-zoom-menu">
                  {[2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25].map(level => (
                    <button
                      class={{ 'ls-dv-zoom-menu-item': true, 'active': Math.round(this.zoom * 100) === Math.round(level * 100) }}
                      onClick={() => {
                        this.setZoom(level);
                        this.showZoomMenu = false;
                        document.removeEventListener('click', this.zoomMenuClickHandler, true);
                      }}
                    >
                      {Math.round(level * 100)}%{Math.round(this.zoom * 100) === Math.round(level * 100) && <ls-icon name="check-icon" size={14} />}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => this.setZoom(this.editor.zoom / 0.8)} id="zoom-in-btn" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('statusbar.zoomin')}>
                <ls-icon name="zoom-in-icon" />
              </button>
            </div>
            {!isPreview && (
              <div class={'ls-dv-status-bar-section'}>
                <button onClick={() => this.fitWidth()} id="fit-width-btn" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('statusbar.fitwidth')}>
                  <ls-icon name="fit-width-icon" />
                </button>
                <button onClick={() => this.fitHeight()} id="fit-height-btn" data-tooltip-id="ls-dv-tooltip" data-tooltip-content={dvI18n.t('statusbar.fitheight')}>
                  <ls-icon name="fit-height-icon" />
                </button>
              </div>
            )}

            <div class={'ls-dv-status-bar-section'} style={this.pageCount === 1 ? { display: 'none' } : {}}>
              <button
                onClick={() => {
                  this.showThumbnails = !this.showThumbnails;
                  if (this.showThumbnails) {
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        this.renderThumbnails();
                        document.addEventListener('click', this.outsideClickHandler);
                      });
                    });
                  } else {
                    document.removeEventListener('click', this.outsideClickHandler);
                  }
                }}
                id="page-thumbnails-btn"
                data-tooltip-id="ls-dv-tooltip"
                data-tooltip-content={dvI18n.t('statusbar.pagethumbnails')}
              >
                <ls-icon name={!this.showThumbnails ? 'side-panel-open-right-icon' : 'side-panel-close-right-icon'} size={18} />
              </button>
            </div>
            {this.showThumbnails && (
              <div class="ls-dv-thumbnail-popover">
                <div id="ls-thumbnail-container" class="ls-dv-thumbnail-grid"></div>
              </div>
            )}
          </div>
          {!isPreview && <ls-helper-bar />}
          <span class="ls-dv-version">v{version}</span>
          <ls-tooltip tooltipId="ls-dv-tooltip" />
          <slot></slot>
        </div>
      </Host>
    );
  }
}
