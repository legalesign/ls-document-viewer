import { newSpecPage } from '@stencil/core/testing';
import { LsPageLoader } from '../ls-page-loader';

describe('ls-page-loader', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsPageLoader],
      html: `<ls-page-loader></ls-page-loader>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-page-loader>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-page-loader>
    `);
  });
});
