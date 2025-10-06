import { Component, Host, Prop, h } from '@stencil/core';
import { Icon } from '../../components';

@Component({
  tag: 'ls-input-wrapper',
  styleUrl: 'ls-input-wrapper.css',
  shadow: true,
})
export class LsInputWrapper {
  @Prop() leadingIcon: Icon;
  @Prop() select: boolean = false;

  render() {
    return (
      <Host>
        <ls-icon id="selectLeadingIcon" name={this.leadingIcon}></ls-icon>
        {this.select && <ls-icon id="selectorIcon" name="selector"></ls-icon>}
        <slot></slot> 
      </Host>
    );
  }
}
