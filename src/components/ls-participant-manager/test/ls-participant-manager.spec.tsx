import { newSpecPage } from '@stencil/core/testing';
import { LsParticipantManager } from '../ls-participant-manager';

describe('ls-participant-manager', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsParticipantManager],
      html: `<ls-participant-manager></ls-participant-manager>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-participant-manager>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-participant-manager>
    `);
  });
});
