import { newSpecPage } from '@stencil/core/testing';
import { LsEditor } from './ls-editor';

describe('ls-editor', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [LsEditor],
      html: '<ls-editor></ls-editor>',
    });
    expect(root).toEqualHtml(`
      <ls-editor>
        <mock:shadow-root>
          <div>
            This is the univeral editor.
          </div>
        </mock:shadow-root>
      </ls-editor>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [LsEditor],
      html: `<ls-editor templateTitle="Editor"  last="JS"></ls-editor>`,
    });
    expect(root).toEqualHtml(`
      <ls-editor templateTitle="Editor" last="JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm a template editor for Legalesign.
          </div>
        </mock:shadow-root>
      </ls-editor>
    `);
  });
});
