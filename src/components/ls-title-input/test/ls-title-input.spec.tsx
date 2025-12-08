import { newSpecPage } from '@stencil/core/testing';
import { LsTitleInput } from '../ls-title-input';

describe('ls-title-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsTitleInput],
      html: `<ls-title-input></ls-title-input>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-title-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-title-input>
    `);
  });
});
