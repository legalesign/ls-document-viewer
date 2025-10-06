import { newSpecPage } from '@stencil/core/testing';
import { LsInputWrapper } from '../ls-input-wrapper';

describe('ls-input-wrapper', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsInputWrapper],
      html: `<ls-input-wrapper></ls-input-wrapper>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-input-wrapper>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-input-wrapper>
    `);
  });
});
