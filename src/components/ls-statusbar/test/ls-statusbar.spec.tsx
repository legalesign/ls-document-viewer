import { newSpecPage } from '@stencil/core/testing';
import { LsStatusbar } from '../ls-statusbar';

describe('ls-statusbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsStatusbar],
      html: `<ls-statusbar></ls-statusbar>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-statusbar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-statusbar>
    `);
  });
});
