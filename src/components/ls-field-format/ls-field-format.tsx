import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-format',
  styleUrl: 'ls-field-format.css',
  shadow: true,
})
export class LsFieldFormat {
  @Prop() dataItem: LSApiElement[];

  render() {
    return (
      <Host>
        {this.dataItem && this.dataItem.length > 1 &&
          <div class={"ls-field-format-bar"}>
            <select onChange={(input) => {
              console.log((input.target as HTMLSelectElement).value)             
            }}>
              <option value="arial">Arial</option>
              <option value="liberation sans">Liberation Sans</option>
              <option value="courier">Courier</option>
              <option value="helvetica">Helvetica</option>
              <option value="verdana">Verdana</option>
            </select>
            <input width="30" size={4} />
            <select>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>}
        {this.dataItem && this.dataItem.length === 1 &&
          <div class={"ls-field-format-bar"}>
            <select>
              <option value="arial">Arial</option>
              <option value="liberation sans">Liberation Sans</option>
              <option value="courier">Courier</option>
              <option value="helvetica">Helvetica</option>
              <option value="verdana">Verdana</option>
            </select>
            <input width="30" size={4} value={this.dataItem[0].fontSize} />
            <select>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>}

      </Host>
    );
  }
}
