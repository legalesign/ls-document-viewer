import { Component, Host, Prop, h } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { getFieldLabel } from '../ls-document-viewer/defaultFieldLabels';
import { getFieldIcon } from '../ls-document-viewer/defaultFieldIcons';

@Component({
  tag: 'ls-field-type-display',
  styleUrl: 'ls-field-type-display.css',
  shadow: true,
})
export class LsFieldTypeDisplay {
  @Prop() assignee: number;
  @Prop() fieldType: string = 'signature';

  render() {
    const color = defaultRolePalette[this.assignee % 100];
    return (
      <Host
        class={'ls-field-type-wrapper'}
        style={{
          border: `1px dashed ${color.s30}`,
          background: color.s10,
        }}
      >
        <div class={'ls-field-type-inner'}>
          <div
            class={'ls-field-type-icon'}
            style={{
              border: `1px solid ${color.s60}`,
              color: color.s60,
              background: color.s10,
            }}
          >
            <ls-icon name={getFieldIcon(this.fieldType)} size="1.25rem" />
          </div>
          <p class={'ls-field-type-name'}>{getFieldLabel(this.fieldType)}</p>
        </div>
      </Host>
    );
  }
}
