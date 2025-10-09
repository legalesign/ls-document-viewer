import { Component, Prop, h, Host, Event as StencilEvent, EventEmitter, State } from '@stencil/core';
import { Icon } from '../../../../types/Icon';
import clsx from 'clsx';

@Component({
  tag: 'ls-text-input',
  styleUrl: 'ls-text-input.css',
  shadow: true,
})
export class LsTextInput {
  @Prop() type: 'default' | 'password' | 'displayonly' = 'default';
  @Prop() name: string;
  @Prop({ mutable: true }) value: string;
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
  @StencilEvent() valueChange: EventEmitter<string>;

  @State() showPassword: boolean = false;

  handlePassword = () => {
    this.showPassword = !this.showPassword;
  };

  changeHandler(event: Event) {
    console.log(event)
    this.valueChange.emit((event.target as any).value as string);
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
      countMax,
      buttonClick,
      buttonIcon,
      fieldIcon,
      showPassword,
      handlePassword,
    } = this;

    const inputClass = clsx(
      'input-base',
      type === 'displayonly'
        ? 'display-only'
        : disabled
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

    return (
      <Host class='host'>
        {fieldIcon && (
          <ls-icon
            id={disabled ? 'fieldIconDisabled' : 'fieldIcon'}
            name={fieldIcon}
          ></ls-icon>
        )}
        {type === 'password' ? (
          <input
            type={showPassword && 'password'}
            class={inputClass}
            id={name}
            name={name}
            value={value}
            maxlength={countMax}
            placeholder={placeholder}
            aria-label={aria}
            required={required}
            disabled={disabled}
            onChange={(e) => {
              this.changeHandler(e)
            }}
          ></input>
        ) : type === 'displayonly' ? (
          <input
            class={inputClass}
            id={name}
            name={name}
            value={value}
            maxlength={countMax}
            placeholder={placeholder}
            aria-label={aria}
            required={required}
            disabled
            onChange={(e) => {
              this.changeHandler(e)
            }}
          />
        ) : (
          <input
            class={inputClass}
            id={name}
            name={name}
            value={value}
            maxlength={countMax}
            placeholder={placeholder}
            aria-label={aria}
            required={required}
            disabled={disabled}
            onChange={(e) => {
              this.changeHandler(e)
            }}
          ></input>
        )}
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
          {type === 'password' && !buttonIcon && (
            <ls-icon-button
              id='password-icon'
              icon={showPassword ? 'eye' : 'eye-off'}
              onClick={handlePassword}
            ></ls-icon-button>
          )}
        </div>
      </Host>
    );
  }
}
