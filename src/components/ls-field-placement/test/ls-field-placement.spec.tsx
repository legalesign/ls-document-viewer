import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPlacement } from '../ls-field-placement';

describe('ls-field-placement', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPlacement],
      html: `<ls-field-placement></ls-field-placement>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-placement>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-placement>
    `);
  });
});
