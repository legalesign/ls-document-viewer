import { newSpecPage } from '@stencil/core/testing';
import { LsZoomBox } from '../ls-zoom-box';

describe('ls-zoom-box', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsZoomBox],
      html: `<ls-zoom-box></ls-zoom-box>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-zoom-box>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-zoom-box>
    `);
  });
});
