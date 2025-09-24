import { newSpecPage } from '@stencil/core/testing';
import { LsToggle } from '../ls-toggle';

describe('ls-toggle', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsToggle],
      html: `<ls-toggle></ls-toggle>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-toggle>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-toggle>
    `);
  });
});
