import { newSpecPage } from '@stencil/core/testing';
import { LsFeatureColoumn } from '../ls-feature-column';

describe('ls-feature-coloumn', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFeatureColoumn],
      html: `<ls-feature-coloumn></ls-feature-coloumn>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-feature-coloumn>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-feature-coloumn>
    `);
  });
});
