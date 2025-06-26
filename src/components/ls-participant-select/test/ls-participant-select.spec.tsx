import { newSpecPage } from '@stencil/core/testing';
import { LsParticipantSelect } from '../ls-participant-select';

describe('ls-participant-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsParticipantSelect],
      html: `<ls-participant-select></ls-participant-select>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-participant-select>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-participant-select>
    `);
  });
});
