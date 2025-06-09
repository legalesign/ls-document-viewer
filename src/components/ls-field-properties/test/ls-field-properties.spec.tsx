import { newSpecPage } from '@stencil/core/testing';
import { LsFieldProperties } from '../ls-field-properties';

describe('ls-field-properties', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldProperties],
      html: `<ls-field-properties></ls-field-properties>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties>
    `);
  });
});
