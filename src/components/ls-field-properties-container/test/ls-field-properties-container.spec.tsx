import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesContainer } from '../ls-field-properties-container';

describe('ls-field-properties-container', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesContainer],
      html: `<ls-field-properties-container></ls-field-properties-container>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-container>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-container>
    `);
  });
});
