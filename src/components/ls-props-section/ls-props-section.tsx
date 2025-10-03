import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ls-props-section',
  styleUrl: 'ls-props-section.css',
  shadow: true,
})
export class LsPropsSection {
  @Prop() sectionTitle: string;
  @Prop() sectionDescription?: string;
  @Prop() row?: boolean = false;

  render() {
    return (
      <Host>
        <div class={this.row ? 'ls-field-properties-section row' : 'ls-field-properties-section'}>
          <div class={'ls-field-properties-section-text'}>
            <p class={'ls-field-properties-section-title'}>{this.sectionTitle}</p>
            {this.sectionDescription && <p class={'ls-field-properties-section-description'}>{this.sectionDescription}</p>}
          </div>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
