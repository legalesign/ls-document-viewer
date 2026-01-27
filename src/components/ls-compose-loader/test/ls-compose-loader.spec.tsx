import { newSpecPage } from '@stencil/core/testing';
import { LsComposeLoader } from '../ls-compose-loader';

describe('ls-compose-loader', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsComposeLoader],
      html: `<ls-compose-loader></ls-compose-loader>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-compose-loader>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-compose-loader>
    `);
  });
});
