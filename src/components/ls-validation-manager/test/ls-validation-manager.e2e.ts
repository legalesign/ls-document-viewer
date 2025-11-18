import { newE2EPage } from '@stencil/core/testing';

describe('ls-validation-manager', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-validation-manager></ls-validation-manager>');

    const element = await page.find('ls-validation-manager');
    expect(element).toHaveClass('hydrated');
  });
});
