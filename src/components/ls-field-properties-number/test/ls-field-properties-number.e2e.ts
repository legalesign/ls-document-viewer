import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-number', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-number></ls-field-properties-number>');

    const element = await page.find('ls-field-properties-number');
    expect(element).toHaveClass('hydrated');
  });
});
