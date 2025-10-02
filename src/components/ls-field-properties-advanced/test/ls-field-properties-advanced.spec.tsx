import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesAdvanced } from '../ls-field-properties-advanced';

describe('ls-field-properties-advanced', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesAdvanced],
      html: `<ls-field-properties-advanced></ls-field-properties-advanced>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-advanced>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-advanced>
    `);
  });
});
