import { newE2EPage } from '@stencil/core/testing';

describe('ls-participant-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-participant-card></ls-participant-card>');

    const element = await page.find('ls-participant-card');
    expect(element).toHaveClass('hydrated');
  });
});
