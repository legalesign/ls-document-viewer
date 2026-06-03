import { newSpecPage } from '@stencil/core/testing';
import { LsTooltip } from '../ls-tooltip';

describe('ls-tooltip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsTooltip],
      html: `<ls-dv-tooltip></ls-dv-tooltip>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-dv-tooltip>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-dv-tooltip>
    `);
  });
});
