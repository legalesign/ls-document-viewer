import { newE2EPage } from '@stencil/core/testing';

describe('ls-participant-manager', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-participant-manager></ls-participant-manager>');

    const element = await page.find('ls-participant-manager');
    expect(element).toHaveClass('hydrated');
  });
});
