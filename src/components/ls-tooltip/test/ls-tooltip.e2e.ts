import { newE2EPage } from '@stencil/core/testing';

describe('ls-tooltip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-tooltip></ls-tooltip>');

    const element = await page.find('ls-tooltip');
    expect(element).toHaveClass('hydrated');
  });
});
