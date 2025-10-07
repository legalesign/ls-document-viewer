import { newSpecPage } from '@stencil/core/testing';
import { LsParticipantCard } from '../ls-participant-card';

describe('ls-participant-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LsParticipantCard],
      html: `<ls-participant-card></ls-participant-card>`,
    });
    expect(page.root).toEqualHtml(`
      <ls-participant-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ls-participant-card>
    `);
  });
});
