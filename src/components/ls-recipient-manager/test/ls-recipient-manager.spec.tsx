import { newSpecPage } from '@stencil/core/testing';
import { LsRecipientManager } from '../ls-recipient-manager';

describe('ls-recipient-manager', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsRecipientManager],
      html: `<ls-recipient-manager></ls-recipient-manager>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-recipient-manager>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-recipient-manager>
    `);
  });
});
