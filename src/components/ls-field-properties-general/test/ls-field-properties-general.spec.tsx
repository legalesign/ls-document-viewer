import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesGeneral } from '../ls-field-properties-general';

describe('ls-field-properties-general', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesGeneral],
      html: `<ls-field-properties-general></ls-field-properties-general>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-general>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-general>
    `);
  });
});
