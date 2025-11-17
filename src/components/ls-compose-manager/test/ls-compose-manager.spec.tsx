import { newSpecPage } from '@stencil/core/testing';
import { LsComposeManager } from '../ls-compose-manager';

describe('ls-compose-manager', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsComposeManager],
      html: `<ls-compose-manager></ls-compose-manager>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-compose-manager>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-compose-manager>
    `);
  });
});
