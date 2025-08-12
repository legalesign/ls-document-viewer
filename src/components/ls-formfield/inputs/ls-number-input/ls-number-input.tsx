import { Component, Prop,  h } from '@stencil/core';
import { Icon } from '../../../../types/Icon';
import clsx from 'clsx';

@Component({
  tag: 'ls-number-input',
  styleUrl: 'ls-number-input.css',
  shadow: true,
})
export class LsNumberInput {
  @Prop() type: 'basic' | 'ls' = 'ls';
  @Prop() name: string;
  @Prop({mutable: true}) value: number = 0 ;
  @Prop() placeholder?: string;
  @Prop() aria?: string;
  @Prop() inputRef?: string;
  @Prop() disabled: boolean;
  @Prop() required: boolean;
  @Prop() valid: boolean;
  @Prop() dirty: boolean;
  @Prop() countMax: number;
  @Prop() buttonClick?: any;
  @Prop() buttonIcon?: Icon;
  @Prop() fieldIcon?: Icon;

  handleChange = (event) => {
    this.value = event.target.value;
  }

  private handlePlus = () => {
    this.value = this.value + 1;
  }

  private handleMinus = () => {
    this.value = this.value - 1;
  }

  render() {
    const {
      type,
      name,
      value,
      placeholder,
      aria,
      disabled,
      required,
      valid,
      dirty,
      buttonClick,
      buttonIcon,
      fieldIcon,
      handleChange,
      handleMinus,
      handlePlus,
    } = this;

    const inputClass = clsx(
      type === 'ls' ? 'input-ls' : 'input-basic',
      disabled
        ? 'disabled'
        : dirty && valid
          ? 'valid'
          : dirty && !valid
            ? 'invalid'
            : 'default',
      fieldIcon && 'icon-input',
      dirty && 'button-input',
      buttonIcon && 'button-input',
      buttonIcon && dirty && 'right-items-input',
    );

    const plusMinusClass = clsx(
      disabled ? 'button-disabled' : 'button'
    )

    return (
      <host class={type === 'ls' && 'host'}>
        {type === 'ls' && (
          <button class={plusMinusClass} onClick={() => handleMinus()} disabled={disabled}>
            <ls-icon id='buttonIcon' name='minus-sm'></ls-icon>
          </button>
        )}
        <div class='input-container'>
          {fieldIcon && (
            <ls-icon
              id={disabled ? 'fieldIconDisabled' : 'fieldIcon'}
              name={fieldIcon}
            ></ls-icon>
          )}
          <input
            type='number'
            class={inputClass}
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            aria-label={aria}
            required={required}
            disabled={disabled}
            onInput={(event) => handleChange(event)}
          />
          <div class='right-items'>
            {dirty && !disabled && (
              <ls-icon
                id={valid ? 'validIcon' : 'invalidIcon'}
                name={valid ? 'check-circle' : 'exclamation-circle'}
              ></ls-icon>
            )}
            {buttonIcon && type !== 'ls' && (
              <button class='button' onClick={buttonClick}>
                <ls-icon id='buttonIcon' name={buttonIcon}></ls-icon>
              </button>
            )}
          </div>
        </div>
        {type === 'ls' && (
          <button class={plusMinusClass} onClick={handlePlus} disabled={disabled}>
            <ls-icon id='buttonIcon' name='plus-sm'></ls-icon>
          </button>
        )}
      </host>
    );
  }
}
