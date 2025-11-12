import { newE2EPage } from '@stencil/core/testing';

describe('ls-helper-bar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-helper-bar></ls-helper-bar>');

    const element = await page.find('ls-helper-bar');
    expect(element).toHaveClass('hydrated');
  });
});
