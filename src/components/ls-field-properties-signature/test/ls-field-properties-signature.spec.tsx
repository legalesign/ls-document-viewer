import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesSignature } from '../ls-field-properties-signature';

describe('ls-field-properties-signature', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesSignature],
      html: `<ls-field-properties-signature></ls-field-properties-signature>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-signature>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-signature>
    `);
  });
});
