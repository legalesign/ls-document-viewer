import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesRegex } from '../ls-field-properties-regex';

describe('ls-field-properties-regex', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesRegex],
      html: `<ls-field-properties-regex></ls-field-properties-regex>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-regex>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-regex>
    `);
  });
});
