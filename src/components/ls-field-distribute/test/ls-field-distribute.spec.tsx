import { newSpecPage } from '@stencil/core/testing';
import { LsFieldDistribute } from '../ls-field-distribute';

describe('ls-field-distribute', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldDistribute],
      html: `<ls-field-distribute></ls-field-distribute>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-distribute>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-distribute>
    `);
  });
});
