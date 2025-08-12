import { newSpecPage } from '@stencil/core/testing';
import { LsDocumentOptions } from '../ls-document-options';

describe('ls-document-options', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsDocumentOptions],
      html: `<ls-document-options></ls-document-options>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-document-options>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-document-options>
    `);
  });
});
