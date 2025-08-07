import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesDate } from '../ls-field-properties-date';

describe('ls-field-properties-date', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesDate],
      html: `<ls-field-properties-date></ls-field-properties-date>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-date>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-date>
    `);
  });
});
