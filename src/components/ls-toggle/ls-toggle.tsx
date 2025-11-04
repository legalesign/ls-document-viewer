import { Component, Host, Prop, h, Event as StencilEvent, EventEmitter  } from '@stencil/core';

@Component({
  tag: 'ls-toggle',
  styleUrl: 'ls-toggle.css',
  shadow: false,
})
export class LsToggle {
  @Prop({ mutable: true }) checked: boolean;
  @Prop() indeterminate: boolean;
  @StencilEvent() valueChange: EventEmitter<boolean>;

  changeHandler(value: boolean) {
    this.valueChange.emit(value);
  }

  render() {
    return (
      <Host>
        <label class="switch">
          <input type="checkbox" checked={this.checked}  onChange={(e) => {
            this.changeHandler((e.target as any).checked)
            }
            }/>
          <span class={`${this.indeterminate ? 'indeterminate' : 'slider'} round`}></span>
        </label>
        <slot></slot>
      </Host>
    );
  }
}
