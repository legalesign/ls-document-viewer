import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-text></ls-field-properties-text>');

    const element = await page.find('ls-field-properties-text');
    expect(element).toHaveClass('hydrated');
  });
});
