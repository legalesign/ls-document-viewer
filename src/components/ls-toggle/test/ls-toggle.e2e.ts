import { newE2EPage } from '@stencil/core/testing';

describe('ls-toggle', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-toggle></ls-toggle>');

    const element = await page.find('ls-toggle');
    expect(element).toHaveClass('hydrated');
  });
});
