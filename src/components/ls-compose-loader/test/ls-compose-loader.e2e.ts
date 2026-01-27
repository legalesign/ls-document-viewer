import { newE2EPage } from '@stencil/core/testing';

describe('ls-compose-loader', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-compose-loader></ls-compose-loader>');

    const element = await page.find('ls-compose-loader');
    expect(element).toHaveClass('hydrated');
  });
});
