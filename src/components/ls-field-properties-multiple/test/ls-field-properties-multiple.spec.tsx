import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesMultiple } from '../ls-field-properties-multiple';

describe('ls-field-properties-multiple', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesMultiple],
      html: `<ls-field-properties-multiple></ls-field-properties-multiple>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-multiple>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-multiple>
    `);
  });
});
