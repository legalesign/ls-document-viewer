import { newSpecPage } from '@stencil/core/testing';
import { LsValidationManager } from '../ls-validation-manager';

describe('ls-validation-manager', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsValidationManager],
      html: `<ls-validation-manager></ls-validation-manager>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-validation-manager>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-validation-manager>
    `);
  });
});
