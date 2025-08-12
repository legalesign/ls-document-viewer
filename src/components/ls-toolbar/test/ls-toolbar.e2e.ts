import { newE2EPage } from '@stencil/core/testing';

describe('ls-toolbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-toolbar></ls-toolbar>');

    const element = await page.find('ls-toolbar');
    expect(element).toHaveClass('hydrated');
  });
});
