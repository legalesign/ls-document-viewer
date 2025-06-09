import { newSpecPage } from '@stencil/core/testing';
import { LsSend } from '../ls-send';

describe('ls-send', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsSend],
      html: `<ls-send></ls-send>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-send>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-send>
    `);
  });
});
