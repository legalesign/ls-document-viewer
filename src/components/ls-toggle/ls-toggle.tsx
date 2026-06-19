import { Component, Host, Prop, h, Event as StencilEvent, EventEmitter  } from '@stencil/core';

@Component({
  tag: 'ls-toggle',
  styleUrl: 'ls-toggle.scss',
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
        <label class="ls-dv-switch">
          <input type="checkbox" checked={this.checked}  onChange={(e) => {
            this.changeHandler((e.target as any).checked);
            (e.target as HTMLElement).blur();
            }
            }/>
          <span class={`${this.indeterminate ? 'ls-dv-indeterminate' : 'ls-dv-slider'} ls-dv-round`}></span>
        </label>
        <slot></slot>
      </Host>
    );
  }
}
