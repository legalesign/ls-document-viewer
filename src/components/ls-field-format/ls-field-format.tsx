import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-format',
  styleUrl: 'ls-field-format.css',
  shadow: true,
})
export class LsFieldFormat {
 @Prop() dataItem: LSApiElement;

  render() {
    return (
      <Host>
        <div class={"ls-field-properties-section"}>
          <div>Font: <select>
              <option value="Arial">Liberation Sans</option>
              <option value="Courier">Courier</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Liberation Sans">Liberation Sans</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div>Size:  <input value={this.dataItem?.fontSize} width="30"/></div>
          <div>Align: <select>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select></div>
          <div>Left:  <input value={this.dataItem?.left} width="30"/></div>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
