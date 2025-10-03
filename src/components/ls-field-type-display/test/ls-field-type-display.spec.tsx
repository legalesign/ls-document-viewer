import { newSpecPage } from '@stencil/core/testing';
import { LsFieldTypeDisplay } from '../ls-field-type-display';

describe('ls-field-type-display', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldTypeDisplay],
      html: `<ls-field-type-display></ls-field-type-display>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-type-display>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-type-display>
    `);
  });
});
