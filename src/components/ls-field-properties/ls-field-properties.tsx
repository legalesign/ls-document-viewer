import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-field-properties',
  styleUrl: 'ls-field-properties.css',
  shadow: true,
})
export class LsFieldProperties {
  render() {
    return (
      <Host>
        <div class={"ls-field-properties-section"}>Content</div>
        <div class={"ls-field-properties-section"}>Format</div>
        <div class={"ls-field-properties-section"}>Placement</div>
        <div class={"ls-field-properties-section"}>Dimensions</div>
        <div class={"ls-field-properties-section"}>Advanced</div>
      </Host>
    );
  }
}
