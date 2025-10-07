import { newSpecPage } from '@stencil/core/testing';
import { LsPropsSection } from '../ls-props-section';

describe('ls-props-section', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsPropsSection],
      html: `<ls-props-section></ls-props-section>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-props-section>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-props-section>
    `);
  });
});
