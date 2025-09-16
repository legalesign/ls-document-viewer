import { newSpecPage } from '@stencil/core/testing';
import { LsFieldPropertiesAutosign } from '../ls-field-properties-autosign';

describe('ls-field-properties-autosign', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsFieldPropertiesAutosign],
      html: `<ls-field-properties-autosign></ls-field-properties-autosign>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-field-properties-autosign>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-field-properties-autosign>
    `);
  });
});
