import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesText } from '../ls-field-properties-text';

describe('ls-field-properties-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesText],
      html: `<ls-field-properties-text></ls-field-properties-text>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-text>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-text>
    `);
  });
});
