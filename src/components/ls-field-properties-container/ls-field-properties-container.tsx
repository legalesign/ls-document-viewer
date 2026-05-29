import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';

@Component({
  tag: 'ls-field-properties-container',
  styleUrl: 'ls-field-properties-container.scss',
  shadow: true,
})
export class LsFieldPropertiesContainer {
  @Prop() dataItem: LSApiElement;
  @Prop() tabs: string[] = [];
  @Prop({ mutable: true, reflect: true}) selectedTab: string;

  componentWillLoad() {
    if (!this.selectedTab) {
      this.selectedTab = this.tabs[0] || '';
    }
  }

  render() {
    return (
      <Host>
        {this.tabs.length > 1 && (
          <div class={'ls-dv-tabs-container'} style={{ gridTemplateColumns: `repeat(${this.tabs.length}, 1fr)` }}>
            {this.tabs.map(tab => (
              <button class={tab === this.selectedTab ? 'ls-dv-tab ls-dv-active' : 'ls-dv-tab'} onClick={() => (this.selectedTab = tab)}>
                {tab}
              </button>
            ))}
          </div>
        )}
        <div class={'ls-dv-scrolling-container'}>
          <slot name={this.selectedTab}></slot>
        </div>
      </Host>
    );
  }
}
