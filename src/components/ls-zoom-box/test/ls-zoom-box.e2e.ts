import { newE2EPage } from '@stencil/core/testing';

describe('ls-zoom-box', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-zoom-box></ls-zoom-box>');

    const element = await page.find('ls-zoom-box');
    expect(element).toHaveClass('hydrated');
  });
});
