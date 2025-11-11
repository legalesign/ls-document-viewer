import { newSpecPage } from '@stencil/core/testing';
import { LsKeyboardShortcuts } from '../ls-keyboard-shortcuts';

describe('ls-keyboard-shortcuts', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsKeyboardShortcuts],
      html: `<ls-keyboard-shortcuts></ls-keyboard-shortcuts>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-keyboard-shortcuts>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-keyboard-shortcuts>
    `);
  });
});
