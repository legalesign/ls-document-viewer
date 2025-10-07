import { newSpecPage } from '@stencil/core/testing';
import { LsFieldContent } from '../ls-field-content';

describe('ls-field-content', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldContent],
      html: `<ls-field-content></ls-field-content>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-content>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-content>
    `);
  });
});
