import { Component, Host, Prop, Watch, h } from '@stencil/core';
import { LSApiElement } from '../../types/LSApiElement';

@Component({
  tag: 'ls-field-properties',
  styleUrl: 'ls-field-properties.css',
  shadow: true,
})
export class LsFieldProperties {
  @Prop() dataItem: LSApiElement[];

  render() {
    return (
      <Host>
        {(this.dataItem && this.dataItem?.length === 1) ? <>
          <div class={"ls-field-properties-section"}>Single Field</div>
            <div class={"ls-field-properties-section"}>
              <div>Height: {this.dataItem[0]?.height}</div>
              <div>Width: {this.dataItem[0]?.width}</div>
              <div>Top: {this.dataItem[0]?.top}</div>
              <div>Left: {this.dataItem[0]?.left}</div>

            </div>
          <div class={"ls-field-properties-section"}>Format</div>
          <div class={"ls-field-properties-section"}>Placement</div>
          <div class={"ls-field-properties-section"}>Dimensions</div>
          <div class={"ls-field-properties-section"}>Advanced</div>

        </> :
          this.dataItem ? 
          <>
            <div class={"ls-field-properties-section"}>Selected {this.dataItem?.length}</div>
 
            <div class={"ls-field-properties-section"}>Placement</div>
            <div class={"ls-field-properties-section"}>Dimensions</div>
            <div class={"ls-field-properties-section"}>Advanced</div>

          </>
          : <></>
        }
      </Host>
    );
  }
}
