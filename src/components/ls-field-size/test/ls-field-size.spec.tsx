import { newSpecPage } from '@stencil/core/testing';
import { LsFieldSize } from '../ls-field-size';

describe('ls-field-size', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldSize],
      html: `<ls-field-size></ls-field-size>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-size>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-size>
    `);
  });
});
