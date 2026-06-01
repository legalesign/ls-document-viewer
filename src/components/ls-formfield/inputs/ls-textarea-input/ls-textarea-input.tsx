import { Component, Prop, h } from '@stencil/core';
import { Icon } from '../../../../types/Icon';
import clsx from 'clsx';

@Component({
  tag: 'ls-textarea-input',
  styleUrl: 'ls-textarea-input.scss',
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
      'ls-dv-input-base',
      disabled
        ? 'ls-dv-disabled'
        : dirty && valid
          ? 'ls-dv-valid'
          : dirty && !valid
            ? 'ls-dv-invalid'
            : displayOnly
              ? 'displayOnly'
              : 'ls-dv-default',
      fieldIcon && 'ls-dv-icon-input',
      dirty && 'ls-dv-button-input',
      buttonIcon && 'ls-dv-button-input',
      buttonIcon && dirty && 'ls-dv-right-items-input',
    );

    return (
      <host class='ls-dv-host'>
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
        <div class='ls-dv-right-items'>
          {dirty && !disabled && (
            <ls-icon
              id={valid ? 'validIcon' : 'invalidIcon'}
              name={valid ? 'check-circle' : 'exclamation-circle'}
            ></ls-icon>
          )}
          {buttonIcon && (
            <button class='ls-dv-button' onClick={buttonClick}>
              <ls-icon id='buttonIcon' name={buttonIcon}></ls-icon>
            </button>
          )}
        </div>
      </host>
    );
  }
}
