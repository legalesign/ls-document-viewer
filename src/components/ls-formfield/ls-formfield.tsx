import { Component, Prop, h, Event as StencilEvent, EventEmitter  } from '@stencil/core';
import { Icon } from '../../types/Icon';
import { State, Watch } from '@stencil/core/internal';

@Component({
  tag: 'ls-formfield',
  styleUrl: 'ls-formfield.css',
  shadow: false,
})
export class LsFormfield {
  @Prop() name: string;
  @Prop() fieldId: string;
  @Prop() label?: string;
  @Prop() as?: 'text' | 'select' | 'radio' | 'textarea' | 'password' | 'number' | 'displayonly' = 'text';
  @Prop({ mutable: true }) value?: string | number;
  @Prop() placeholder?: string;
  @Prop() descriptionText?: string;
  @Prop() errorText?: string;
  @Prop() aria?: string;
  @Prop() inputRef?: string;
  @Prop() infoTooltipText?: string;
  @Prop() hoverTooltipText?: string;
  @Prop() disabled: boolean;
  @Prop() extraLabel: 'optional' | 'required' | 'none' = 'none';
  @Prop() required: boolean;
  @Prop() valid: boolean;
  @Prop() dirty: boolean;
  @Prop() count: boolean;
  @Prop() countMax?: number;
  @Prop() buttonClick?: () => void;
  @Prop() buttonIcon?: Icon;
  @Prop() labelIcon?: Icon;
  @Prop() fieldIcon?: Icon;
  @StencilEvent() onChange: EventEmitter<Event>;

  changeHandler(event: Event) {
    this.onChange.emit(event);
  }

  @State() _value: string;

  @Watch('value')
  valueWatcher(newValue: string) {
    this._value = newValue;
    console.log(newValue)
  }

  componentWillLoad() {
    this.valueWatcher(this?.value?.toString());
  }

  render() {
    const {
      name,
      fieldId,
      label,
      as,
      value,
      placeholder,
      descriptionText,
      errorText,
      aria,
      infoTooltipText,
      disabled,
      extraLabel,
      valid,
      dirty,
      count,
      countMax,
      buttonClick,
      buttonIcon,
      fieldIcon,
      labelIcon,
    } = this;

    const countClass = value && value.toString().length > countMax ? 'formfield-count-error' : 'formfield-count';

    return (
      <host class="formfield-host">
        {label?.length > 1 || extraLabel !== 'none' && (
          <div class="formfield-top-elements">
            <div class="formfield-left-side">
              {labelIcon && <ls-icon name={labelIcon}></ls-icon>}
              <label htmlFor={name} class="formfield-label">
                {label}
              </label>
              {infoTooltipText && <ls-icon name={'information-circle'}></ls-icon>}
            </div>

            {extraLabel === 'optional' ? (
              <ls-label text="Optional" colour="gray" type="low"></ls-label>
            ) : extraLabel === 'required' ? (
              <ls-label text="Required" colour="gray" type="low"></ls-label>
            ) : (
              ''
            )}
          </div>
        )}
        {as === 'text' ? (
          <ls-text-input
            id={fieldId}
            name={name}
            value={value?.toString()}
            countMax={countMax}
            placeholder={placeholder}
            aria-label={aria}
            required={extraLabel === 'required'}
            disabled={disabled}
            valid={valid}
            dirty={dirty}
            buttonIcon={buttonIcon}
            buttonClick={buttonClick}
            fieldIcon={fieldIcon}
            onChange={this.changeHandler}
          ></ls-text-input>
        ) : as === 'select' ? (
          <ls-select-input
            id={name}
            name={name}
            aria-label={aria}
            required={extraLabel === 'required'}
            disabled={disabled}
            valid={valid}
            dirty={dirty}
            buttonIcon={buttonIcon}
            buttonClick={buttonClick}
            fieldIcon={fieldIcon}
            onChange={this.changeHandler}
          >
            <slot></slot>
          </ls-select-input>
        ) : as === 'radio' ? (
          <ls-radio-input radioId={label} label={value?.toString()} icon={fieldIcon} name={name} disabled={disabled} />
        ) : as === 'textarea' ? (
          <ls-textarea-input
            id={name}
            name={name}
            value={value?.toString()}
            countMax={countMax}
            placeholder={placeholder}
            aria-label={aria}
            required={extraLabel === 'required'}
            disabled={disabled}
            valid={valid}
            dirty={dirty}
            buttonIcon={buttonIcon}
            buttonClick={buttonClick}
            fieldIcon={fieldIcon}
            onChange={this.changeHandler}
          />
        ) : as === 'password' ? (
          <ls-text-input
            type="password"
            id={name}
            name={name}
            value={value?.toString()}
            countMax={countMax}
            placeholder={placeholder}
            aria-label={aria}
            required={extraLabel === 'required'}
            disabled={disabled}
            valid={valid}
            dirty={dirty}
            buttonIcon={buttonIcon}
            buttonClick={buttonClick}
            fieldIcon={fieldIcon}
            onChange={this.changeHandler}
          />
        ) : as === 'displayonly' ? (
          <ls-text-input
            type="displayonly"
            id={name}
            name={name}
            value={value?.toString()}
            countMax={countMax}
            placeholder={placeholder}
            aria-label={aria}
            required={extraLabel === 'required'}
            disabled={disabled}
            valid={valid}
            dirty={dirty}
            buttonIcon={buttonIcon}
            buttonClick={buttonClick}
            fieldIcon={fieldIcon}
          />
        ) : as === 'number' ? (
          <ls-number-input
            type="ls"
            id={name}
            name={name}
            value={Number(value)}
            countMax={countMax}
            placeholder={placeholder}
            aria-label={aria}
            required={extraLabel === 'required'}
            disabled={disabled}
            valid={valid}
            dirty={dirty}
            buttonIcon={buttonIcon}
            buttonClick={buttonClick}
            fieldIcon={fieldIcon}
            onChange={this.changeHandler}
          />
        ) : (
          <p>placeholder</p>
        )}
        {errorText ||
          count ||
          countMax ||
          (descriptionText && (
            <div class="formfield-bottom-elements">
              {errorText && !valid ? <p class="formfield-error-text">{errorText}</p> : descriptionText ? <p class="formfield-description-text">{descriptionText}</p> : ''}
              {count && (
                <div class="formfield-count-container">
                  <p class={countClass}>{value?.toString()?.length}</p>
                  {countMax > 0 && (
                    <div class={countClass}>
                      <p>/</p>
                      <p>{countMax}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </host>
    );
  }
}
