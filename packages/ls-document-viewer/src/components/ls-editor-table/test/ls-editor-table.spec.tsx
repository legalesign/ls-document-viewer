import { newSpecPage } from '@stencil/core/testing';
import { LsEditorTable } from '../ls-editor-table';

describe('ls-editor-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsEditorTable],
      html: `<ls-editor-table></ls-editor-table>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-editor-table>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-editor-table>
    `);
  });
});
