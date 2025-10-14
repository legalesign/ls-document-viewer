import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesDropdown } from '../ls-field-properties-dropdown';

describe('ls-field-properties-dropdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesDropdown],
      html: `<ls-field-properties-dropdown></ls-field-properties-dropdown>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-dropdown>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-dropdown>
    `);
  });
});
