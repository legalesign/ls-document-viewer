import { newE2EPage } from '@stencil/core/testing';

describe('ls-recipient-manager', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-recipient-manager></ls-recipient-manager>');

    const element = await page.find('ls-recipient-manager');
    expect(element).toHaveClass('hydrated');
  });
});
