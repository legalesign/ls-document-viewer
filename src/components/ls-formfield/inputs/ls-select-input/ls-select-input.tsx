import { Component, Prop, h } from '@stencil/core';
import { Icon } from '../../../../types/Icon';
import clsx from 'clsx';

@Component({
  tag: 'ls-select-input',
  styleUrl: 'ls-select-input.css',
  shadow: false,
})
export class LsSelectInput {
  @Prop() name: string;
  @Prop() value: string;
  @Prop() aria?: string;
  @Prop() inputRef?: string;
  @Prop() disabled: boolean;
  @Prop() displayOnly: boolean;
  @Prop() required: boolean;
  @Prop() valid: boolean;
  @Prop() dirty: boolean;
  @Prop() buttonClick?: any;
  @Prop() buttonIcon?: Icon;
  @Prop() fieldIcon?: Icon;

  // handleChange(event) {
  //   this.value = event.target.value;
  // }

  render() {
    const {
      name,
      aria,
      disabled,
      displayOnly,
      required,
      valid,
      dirty,
      buttonClick,
      buttonIcon,
      fieldIcon,
    } = this;

    const inputClass = clsx(
      'input-base',
      disabled
        ? 'disabled'
        : dirty && valid
          ? 'valid'
          : dirty && !valid
            ? 'invalid'
            : displayOnly
              ? 'displayOnly'
              : 'default',
      fieldIcon && 'icon-input',
      dirty && 'button-input',
      buttonIcon && 'button-input',
      buttonIcon && dirty && 'right-items-input',
    );

    return (
      <host class='host'>
        {fieldIcon && (
          <ls-icon
            id={disabled ? 'fieldIconDisabled' : 'fieldIcon'}
            name={fieldIcon}
          ></ls-icon>
        )}
        <select
          class={inputClass}
          id={name}
          name={name}
          aria-label={aria}
          required={required}
          disabled={disabled}
        >
          <slot />
        </select>
        <div class='right-items'>
          {dirty && !disabled && (
            <ls-icon
              id={valid ? 'validIcon' : 'invalidIcon'}
              name={valid ? 'check-circle' : 'exclamation-circle'}
            ></ls-icon>
          )}
          {buttonIcon ? (
            <button class='button' onClick={buttonClick}>
              <ls-icon id='buttonIcon' name={buttonIcon}></ls-icon>
            </button>
          ) : (<ls-icon
            id={disabled ? 'select-arrow-disabled' : 'select-arrow'}
            name={'chevron-down'}
          ></ls-icon>) }
        </div>
      </host>
    );
  }
}
