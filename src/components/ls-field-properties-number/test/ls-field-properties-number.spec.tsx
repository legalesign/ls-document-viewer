import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesNumber } from '../ls-field-properties-number';

describe('ls-field-properties-number', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesNumber],
      html: `<ls-field-properties-number></ls-field-properties-number>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-number>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-number>
    `);
  });
});
