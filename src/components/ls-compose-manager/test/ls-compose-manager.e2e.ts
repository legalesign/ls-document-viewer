import { newE2EPage } from '@stencil/core/testing';

describe('ls-compose-manager', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-compose-manager></ls-compose-manager>');

    const element = await page.find('ls-compose-manager');
    expect(element).toHaveClass('hydrated');
  });
});
