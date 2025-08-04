import { newSpecPage } from '@stencil/core/testing';
import { LsEditorField } from '../ls-editor-field';

describe('ls-editor-field', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsEditorField],
      html: `<ls-editor-field></ls-editor-field>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-editor-field>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-editor-field>
    `);
  });
});
