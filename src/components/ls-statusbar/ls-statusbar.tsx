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
  @Prop({ mutable: true }) zoom: number
  /**
* The zoom or scale level 100 === 100%.
* {number}
*/
  @Prop() editor: LsDocumentViewer;

  setZoom(value: number) {
    this.editor.setZoom(value)
    this.zoom = value
  }

  handleZoomInput() {
    const zoomInput = this.component.shadowRoot.getElementById("zoomRange") as HTMLInputElement
    console.log(Math.floor(parseInt(zoomInput.value) / 100))
    debounce(this.setZoom(parseInt(zoomInput.value) / 100), 700)
    
  }

  fitWidth() {
    const frame = this.editor.component.shadowRoot.getElementById('ls-document-frame')
    this.setZoom(frame.clientWidth / this.editor.pageDimensions[0].width)
  }


  fitHeight() {
    const frame = this.editor.component.shadowRoot.getElementById('ls-document-frame')
    this.setZoom(frame.clientHeight / this.editor.pageDimensions[0].height)
  }

   componentDidLoad() {
    this.zoom = this.editor.zoom
   }

  render() {
    return (
      <Host>

        <button><ls-icon name="table" /></button>
        <button><ls-icon name="template" /></button>


        <button onClick={() => this.fitWidth()}><ls-icon name="fit-width" /></button>
        <button onClick={() => this.fitHeight()}><ls-icon name="fit-height" /></button>
        <button onClick={() => { this.editor.pagePrev() }}><ls-icon name="arrow-left" /></button>
        <button onClick={() => { this.editor.pageNext() }}><ls-icon name="arrow-right" /></button>


        <button onClick={() => this.setZoom(this.editor.zoom * 0.8)}><ls-icon name="zoom-out" /></button>
        <div><input type="range" min="1" max="300" value={this.zoom * 100} class="slider" id="zoomRange" onInput={() => this.handleZoomInput()} /></div>
        <button onClick={() => this.setZoom(this.editor.zoom / 0.8)}><ls-icon name="zoom-in" /></button>


        <slot></slot>
      </Host>
    );
  }
}
