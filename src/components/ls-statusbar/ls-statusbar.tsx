import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ls-statusbar',
  styleUrl: 'ls-statusbar.css',
  shadow: true,
})
export class LsStatusbar {

    /**
     * The zoom or scale level 1.0 === 100%.
     * {LSApiTemplate}
     */
    @Prop() scale: number;
    

  render() {
    return (
      <Host>

        <button><ls-icon name="table" /></button>
        <button><ls-icon name="template" /></button>

        <button><ls-icon name="zoom-in" /></button>
        <button><ls-icon name="zoom-out" /></button>

        <button><ls-icon name="fit-width" /></button>
        <button><ls-icon name="fit-height" /></button>
        <div><input type="range" min="10" max="300" value="100" class="slider" id="myRange"></input></div>
        
        <slot></slot>
      </Host>
    );
  }
}
