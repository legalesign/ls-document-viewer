import { newE2EPage } from '@stencil/core/testing';

describe('ls-statusbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-statusbar></ls-statusbar>');

    const element = await page.find('ls-statusbar');
    expect(element).toHaveClass('hydrated');
  });
});
