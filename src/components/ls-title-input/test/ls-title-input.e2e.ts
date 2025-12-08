import { newE2EPage } from '@stencil/core/testing';

describe('ls-title-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-title-input></ls-title-input>');

    const element = await page.find('ls-title-input');
    expect(element).toHaveClass('hydrated');
  });
});
