import { newSpecPage } from '@stencil/core/testing';
import { LsRecipientCard } from '../ls-recipient-card';

describe('ls-recipient-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsRecipientCard],
      html: `<ls-recipient-card></ls-recipient-card>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-recipient-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-recipient-card>
    `);
  });
});
