import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesEmail } from '../ls-field-properties-email';

describe('ls-field-properties-email', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesEmail],
      html: `<ls-field-properties-email></ls-field-properties-email>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-email>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-email>
    `);
  });
});
