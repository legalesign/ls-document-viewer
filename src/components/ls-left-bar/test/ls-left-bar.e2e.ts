import { newE2EPage } from '@stencil/core/testing';

describe('ls-left-bar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-left-bar></ls-left-bar>');

    const element = await page.find('ls-left-bar');
    expect(element).toHaveClass('hydrated');
  });
});
