import { newSpecPage } from '@stencil/core/testing';
import { LsSender } from '../ls-sender';

describe('ls-sender', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsSender],
      html: `<ls-sender></ls-sender>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-sender>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-sender>
    `);
  });
});
