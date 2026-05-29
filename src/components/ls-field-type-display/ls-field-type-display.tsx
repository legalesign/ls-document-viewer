import { Component, Host, Prop, h } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { getFieldLabel } from '../ls-document-viewer/defaultFieldLabels';
import { getFieldIcon } from '../ls-document-viewer/defaultFieldIcons';

@Component({
  tag: 'ls-field-type-display',
  styleUrl: 'ls-field-type-display.scss',
  shadow: true,
})
export class LsFieldTypeDisplay {
  @Prop() assignee: number;
  @Prop() fieldType: string = 'signature';

  render() {
    const color = defaultRolePalette[this.assignee % 100];
    return (
      <Host
        class={'ls-dv-field-type-wrapper'}
        style={{
          border: `1px dashed ${color.s30}`,
          background: color.s10,
        }}
      >
        <div class={'ls-dv-field-type-inner'}>
          <div
            class={'ls-dv-field-type-icon'}
            style={{
              border: `1px solid ${color.s60}`,
              color: color.s60,
              background: color.s10,
            }}
          >
            <ls-icon name={getFieldIcon(this.fieldType)} size="1.25rem" />
          </div>
          <p class={'ls-dv-field-type-name'}>{getFieldLabel(this.fieldType)}</p>
        </div>
      </Host>
    );
  }
}
