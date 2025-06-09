import { newE2EPage } from '@stencil/core/testing';

describe('ls-send', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-send></ls-send>');

    const element = await page.find('ls-send');
    expect(element).toHaveClass('hydrated');
  });
});
