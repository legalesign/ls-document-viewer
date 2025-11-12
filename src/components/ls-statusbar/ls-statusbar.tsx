import { Component, Host, Prop, h, Element } from '@stencil/core';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';
import { debounce } from '../ls-document-viewer/editorUtils';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-statusbar',
  styleUrl: 'ls-statusbar.css',
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

  /**
   * The parent editor control.
   * {LsDocumentViewer}
   */
  @Prop() editor: LsDocumentViewer;

  setZoom(value: number) {
    this.editor.setZoom(value);
    this.zoom = value;
  }

  handleZoomInput() {
    const zoomInput = this.component.shadowRoot.getElementById('zoomRange') as HTMLInputElement;

    debounce(this.setZoom(parseInt(zoomInput.value) / 100), 700);
  }

  fitWidth() {
    const leftBox = this.editor.component.shadowRoot.getElementById('ls-left-box');
    const space = window.screen.width - leftBox.clientWidth - 60; // 40 for padding/margin

    console.log('Space width:', space, 'Page width:', this.editor.pageDimensions[0].width);
    const scale: number = space / this.editor.pageDimensions[0].width;
    console.log(Math.round(scale * 1e2) / 1e2);
    this.setZoom(Math.round(scale * 1e2) / 1e2);
  }

  fitHeight() {
    const space = window.screen.height - 40; // 40 for padding/margin
    const scale: number = space / this.editor.pageDimensions[0].height;
    this.setZoom(Math.round(scale * 1e2) / 1e2);
  }

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
    this.zoom = this.editor.zoom;
  }

  render() {
    return (
      <Host>
        <div class={'controls-bar'}>
        {/* <button onClick={() => this.editor.displayTable = true}><ls-icon name="table" /></button>
        <button onClick={() => this.editor.displayTable = false}><ls-icon name="template" /></button> */}
        <div class={'status-bar-section'}>
          <button onClick={() => this.setZoom(this.editor.zoom * 0.8)} id="zoom-out-btn" data-tooltip="Zoom Out">
            <ls-icon name="zoom-out" />
          </button>
          <div>
            <input type="range" min="1" max="300" value={this.zoom * 100} class="slider" id="zoomRange" onInput={() => this.handleZoomInput()} />
          </div>
          <button onClick={() => this.setZoom(this.editor.zoom / 0.8)} id="zoom-in-btn" data-tooltip="Zoom In">
            <ls-icon name="zoom-in" />
          </button>
        </div>
        <div class={'status-bar-section'}>
          <button onClick={() => this.fitWidth()} id="fit-width-btn" data-tooltip="Fit Width">
            <ls-icon name="fit-width" />
          </button>
          <button onClick={() => this.fitHeight()} id="fit-height-btn" data-tooltip="Fit Height">
            <ls-icon name="fit-height" />
          </button>
        </div>
        <div class={'status-bar-section'} style={this.pageCount === 1 && { display: 'none' }}>
          <button
            onClick={() => {
              this.editor.pagePrev();
            }}
            disabled={this.page === 1}
            id="prev-page-btn"
            data-tooltip={this.page === 1 ? 'No Previous Page' : 'Previous Page'}
          >
            <ls-icon name="chevron-left" />
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
            data-tooltip={this.page === this.pageCount ? 'No Next Page' : 'Next Page'}
          >
            <ls-icon name="chevron-right" />
          </button>
        </div>
        </div>
        <ls-helper-bar />
        <ls-tooltip id="ls-tooltip-master" />
        <slot></slot>
      </Host>
    );
  }
}
