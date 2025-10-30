import { newE2EPage } from '@stencil/core/testing';

describe('ls-page-loader', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-page-loader></ls-page-loader>');

    const element = await page.find('ls-page-loader');
    expect(element).toHaveClass('hydrated');
  });
});
