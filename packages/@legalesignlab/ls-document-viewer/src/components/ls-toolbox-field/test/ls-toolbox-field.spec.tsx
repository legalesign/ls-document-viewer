import { newSpecPage } from '@stencil/core/testing';
import { LsToolboxField } from '../ls-toolbox-field';

describe('ls-toolbox-field', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsToolboxField],
      html: `<ls-toolbox-field></ls-toolbox-field>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-toolbox-field>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-toolbox-field>
    `);
  });
});
