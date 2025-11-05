import { newSpecPage } from '@stencil/core/testing';
import { LsTooltip } from '../ls-tooltip';

describe('ls-tooltip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsTooltip],
      html: `<ls-tooltip></ls-tooltip>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-tooltip>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-tooltip>
    `);
  });
});
