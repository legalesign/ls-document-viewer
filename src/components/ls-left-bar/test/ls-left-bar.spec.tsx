import { newSpecPage } from '@stencil/core/testing';
import { LsLeftBar } from '../ls-left-bar';

describe('ls-left-bar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsLeftBar],
      html: `<ls-left-bar></ls-left-bar>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-left-bar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-left-bar>
    `);
  });
});
