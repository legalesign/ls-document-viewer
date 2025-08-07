import { newSpecPage } from '@stencil/core/testing';
import { LsToolbar } from '../ls-toolbar';

describe('ls-toolbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsToolbar],
      html: `<ls-toolbar></ls-toolbar>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-toolbar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-toolbar>
    `);
  });
});
