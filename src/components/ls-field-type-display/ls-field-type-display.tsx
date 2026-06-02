import { Component, Host, Prop, h } from '@stencil/core';
import { defaultRolePalette } from '../ls-document-viewer/defaultPalette';
import { getFieldIcon } from '../ls-document-viewer/defaultFieldIcons';
import { dvI18n } from '../../i18n/i18n';

const fieldTypeKeyMap: { [key: string]: string } = {
  'signature': 'toolbox.signature',
  'auto sign': 'toolbox.autosign',
  'text': 'toolbox.text',
  'signing date': 'toolbox.signingdate',
  'date': 'toolbox.date',
  'initials': 'toolbox.initials',
  'checkbox': 'toolbox.checkbox',
  'email': 'toolbox.email',
  'number': 'toolbox.number',
  'image': 'toolbox.image',
  'dropdown': 'toolbox.dropdown',
  'file': 'toolbox.file',
  'drawn field': 'toolbox.drawn',
  'drawn': 'toolbox.drawn',
  'regular expression': 'toolbox.regex',
  'regex': 'toolbox.regex',
};

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
          <p class={'ls-dv-field-type-name'}>{dvI18n.t(fieldTypeKeyMap[this.fieldType] || 'toolbox.text')}</p>
        </div>
      </Host>
    );
  }
}
