import { newSpecPage } from '@stencil/core/testing';
import { LsFieldDimensions } from '../ls-field-dimensions';

describe('ls-field-dimensions', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldDimensions],
      html: `<ls-field-dimensions></ls-field-dimensions>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-dimensions>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-dimensions>
    `);
  });
});
