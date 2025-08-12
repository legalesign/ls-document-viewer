import { newSpecPage } from '@stencil/core/testing';
import { LsFieldAlignment } from '../ls-field-alignment';

describe('ls-field-alignment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldAlignment],
      html: `<ls-field-alignment></ls-field-alignment>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-alignment>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-alignment>
    `);
  });
});
