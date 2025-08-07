import { Component, Prop, h } from '@stencil/core';
import { Icon } from '../../../../types/Icon';
import clsx from 'clsx';

@Component({
  tag: 'ls-textarea-input',
  styleUrl: 'ls-textarea-input.css',
  shadow: true,
})
export class LsTextareaInput {
  @Prop() name: string;
  @Prop() value?: string;
  @Prop() placeholder?: string;
  @Prop() aria?: string;
  @Prop() inputRef?: string;
  @Prop() disabled: boolean;
  @Prop() displayOnly: boolean;
  @Prop() required: boolean;
  @Prop() valid: boolean;
  @Prop() dirty: boolean;
  @Prop() countMax: number;
  @Prop() buttonClick?: any;
  @Prop() buttonIcon?: Icon;
  @Prop() fieldIcon?: Icon;

  render() {
    const {
      name,
      value,
      placeholder,
      aria,
      disabled,
      displayOnly,
      required,
      valid,
      dirty,
      countMax,
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
        <textarea
          class={inputClass}
          id={name}
          name={name}
          value={value}
          maxlength={countMax}
          placeholder={placeholder}
          aria-label={aria}
          required={required}
          disabled={disabled}
        />
        <div class='right-items'>
          {dirty && !disabled && (
            <ls-icon
              id={valid ? 'validIcon' : 'invalidIcon'}
              name={valid ? 'check-circle' : 'exclamation-circle'}
            ></ls-icon>
          )}
          {buttonIcon && (
            <button class='button' onClick={buttonClick}>
              <ls-icon id='buttonIcon' name={buttonIcon}></ls-icon>
            </button>
          )}
        </div>
      </host>
    );
  }
}
