import { newE2EPage } from '@stencil/core/testing';

describe('ls-keyboard-shortcuts', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-keyboard-shortcuts></ls-keyboard-shortcuts>');

    const element = await page.find('ls-keyboard-shortcuts');
    expect(element).toHaveClass('hydrated');
  });
});
