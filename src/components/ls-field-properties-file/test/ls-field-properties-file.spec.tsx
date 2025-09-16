import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesFile } from '../ls-field-properties-file';

describe('ls-field-properties-file', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesFile],
      html: `<ls-field-properties-file></ls-field-properties-file>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-file>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-file>
    `);
  });
});
