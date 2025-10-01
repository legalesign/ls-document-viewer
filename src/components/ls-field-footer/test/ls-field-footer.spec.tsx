import { newSpecPage } from '@stencil/core/testing';
import { LsFieldFooter } from '../ls-field-footer';

describe('ls-field-footer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldFooter],
      html: `<ls-field-footer></ls-field-footer>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-footer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-footer>
    `);
  });
});
