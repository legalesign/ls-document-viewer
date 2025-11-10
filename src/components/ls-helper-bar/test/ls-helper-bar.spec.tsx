import { newSpecPage } from '@stencil/core/testing';
import { LsHelperBar } from '../ls-helper-bar';

describe('ls-helper-bar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsHelperBar],
      html: `<ls-helper-bar></ls-helper-bar>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-helper-bar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-helper-bar>
    `);
  });
});
