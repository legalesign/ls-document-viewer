import { newSpecPage } from '@stencil/core/testing';
import { LsFieldFormat } from '../ls-field-format';

describe('ls-field-format', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldFormat],
      html: `<ls-field-format></ls-field-format>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-format>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-format>
    `);
  });
});
