import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-content></ls-field-content>');

    const element = await page.find('ls-field-content');
    expect(element).toHaveClass('hydrated');
  });
});
