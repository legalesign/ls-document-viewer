import { Component, Host, Prop, h, Element } from '@stencil/core';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';

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
  @Prop() editor: LsDocumentViewer;

  handleZoomInput() {
    const zoomInput = this.component.shadowRoot.getElementById("zoomRange") as HTMLInputElement
    console.log(zoomInput.value)
    this.editor.zoom = Math.floor(parseInt(zoomInput.value) / 100)
    this.editor.renderPage(1)
  }

  render() {
    return (
      <Host>

        <button><ls-icon name="table" /></button>
        <button><ls-icon name="template" /></button>


        <button><ls-icon name="fit-width" /></button>
        <button><ls-icon name="fit-height" /></button>
        <button onClick={()=> { this.editor.pagePrev()}}><ls-icon name="arrow-left" /></button>
        <button onClick={()=> { this.editor.pageNext()}}><ls-icon name="arrow-right" /></button>


        <button onClick={() => this.editor.setZoom(this.editor.zoom * 0.8)}><ls-icon name="zoom-out" /></button>
        <div><input type="range" min="1" max="300" value={Math.floor(this.editor.zoom * 100)} class="slider" id="zoomRange" onInput={() => this.handleZoomInput()} /></div>
        <button onClick={() => this.editor.setZoom(this.editor.zoom / 0.8)}><ls-icon name="zoom-in" /></button>


        <slot></slot>
      </Host>
    );
  }
}
