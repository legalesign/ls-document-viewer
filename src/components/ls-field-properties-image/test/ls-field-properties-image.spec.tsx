import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesImage } from '../ls-field-properties-image';

describe('ls-field-properties-image', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesImage],
      html: `<ls-field-properties-image></ls-field-properties-image>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-image>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-image>
    `);
  });
});
