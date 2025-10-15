import { Component, Host, Prop, h, Element } from '@stencil/core';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';
import { debounce } from '../ls-document-viewer/editorUtils';

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
    const frame = this.editor.component.shadowRoot.getElementById('ls-document-frame');
    const scale: number = frame.clientWidth / this.editor.pageDimensions[0].width;
    this.setZoom(Math.round(scale * 1e2) / 1e2);
  }

  fitHeight() {
    const frame = this.editor.component.shadowRoot.getElementById('ls-document-frame');
    const scale: number = frame.clientHeight / this.editor.pageDimensions[0].height;
    this.setZoom(Math.round(scale * 1e2) / 1e2);
  }

  componentDidLoad() {
    this.zoom = this.editor.zoom;
  }

  

  render() {
    return (
      <Host>
        {/* <button onClick={() => this.editor.displayTable = true}><ls-icon name="table" /></button>
        <button onClick={() => this.editor.displayTable = false}><ls-icon name="template" /></button> */}
        <div class={"status-bar-section"}>

        <button onClick={() => this.setZoom(this.editor.zoom * 0.8)}>
          <ls-icon name="zoom-out" />
        </button>
        <div>
          <input type="range" min="1" max="300" value={this.zoom * 100} class="slider" id="zoomRange" onInput={() => this.handleZoomInput()} />
        </div>
        <button onClick={() => this.setZoom(this.editor.zoom / 0.8)}>
          <ls-icon name="zoom-in" />
        </button>
        </div>
         <div class={"status-bar-section"}>
        <button onClick={() => this.fitWidth()}>
          <ls-icon name="fit-width" />
        </button>
        <button onClick={() => this.fitHeight()}>
          <ls-icon name="fit-height" />
        </button>
        </div>
         <div class={"status-bar-section"}>
        <button
          onClick={() => {
            this.editor.pagePrev();
          }}
        >
          <ls-icon name="chevron-left" />
        </button>
        <p>{this.editor?.pageNum} / {this.editor?._template?.pageCount}</p>
        <button
          onClick={() => {
            this.editor.pageNext();
          }}
        >
          <ls-icon name="chevron-right" />
        </button>
        </div>

        <slot></slot>
      </Host>
    );
  }
}
