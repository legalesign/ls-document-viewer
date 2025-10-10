import { newSpecPage } from '@stencil/core/testing';
import { LsValidationTag } from '../ls-validation-tag';

describe('ls-validation-tag', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsValidationTag],
      html: `<ls-validation-tag></ls-validation-tag>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-validation-tag>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-validation-tag>
    `);
  });
});
