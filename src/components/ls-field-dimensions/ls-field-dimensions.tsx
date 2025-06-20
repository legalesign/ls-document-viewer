import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-dimensions',
  styleUrl: 'ls-field-dimensions.css',
  shadow: true,
})
export class LsFieldDimensions {
  @Prop() dataItem: LSApiElement | LSApiElement[];

  isArray(pet: LSApiElement | LSApiElement[]): pet is LSApiElement {
  return (pet as LSApiElement[]).length !== undefined;
  }

  render() {
    return (
      <Host>
        this.isArray(this.dataItem) ?
        <div class={"ls-field-properties-section"}>
          <div>Height: <input value={""} width="30"/></div>
          <div>Width:  <input value={""} width="30"/></div>
          <div>Top:  <input value={""} width="30"/></div>
          <div>Left:  <input value={""} width="30"/></div>
        </div>
        :
        <div class={"ls-field-properties-section"}>
          <div>Height: <input value={this.dataItem?.height} width="30"/></div>
          <div>Width:  <input value={this.dataItem?.width} width="30"/></div>
          <div>Top:  <input value={this.dataItem?.top} width="30"/></div>
          <div>Left:  <input value={this.dataItem?.left} width="30"/></div>
        </div>
      </Host>
    );
  }
}
