import { newE2EPage } from '@stencil/core/testing';

describe('ls-sender', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-sender></ls-sender>');

    const element = await page.find('ls-sender');
    expect(element).toHaveClass('hydrated');
  });
});
