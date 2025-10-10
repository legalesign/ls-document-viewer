import { newE2EPage } from '@stencil/core/testing';

describe('ls-validation-tag', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-validation-tag></ls-validation-tag>');

    const element = await page.find('ls-validation-tag');
    expect(element).toHaveClass('hydrated');
  });
});
