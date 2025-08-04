import { Component, Prop, h } from '@stencil/core';
import { Icon } from '../../../../types/Icon';
import clsx from 'clsx';

@Component({
  tag: 'ls-radio-input',
  styleUrl: 'ls-radio-input.css',
  shadow: false,
})
export class LsRadioInput {
  @Prop() radioId: string;
  @Prop() label: string;
  @Prop() icon?: Icon;
  @Prop() name?: string = 'name';
  @Prop() checked: boolean = false;
  @Prop() disabled?: boolean = false;
  @Prop() customStyle?: { [key: string]: string };

  render() {
    const {
      label,
      radioId,
      icon,
      name,
      disabled,
      checked,
      customStyle,
    } = this;
    const radioLabelClass = clsx(
      'radioLabel',
      disabled && 'disabled',
      checked && 'checked',
    );

    return (
      <label
        htmlFor={radioId}
        tabIndex={0}
        class={radioLabelClass}
        style={customStyle}
      >
        <input
          type='radio'
          class='inputClass'
          id={radioId}
          name={name}
          value={label}
          disabled={disabled}
          tabIndex={0}
          checked={checked}
        />
        <div class='spanContainer'>
          <span>{icon && <ls-icon name={icon} size={"16"}></ls-icon>}</span>
          <span>{label}</span>
        </div>
      </label>
    );
  }
}
