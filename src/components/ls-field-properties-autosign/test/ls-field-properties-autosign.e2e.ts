import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-autosign', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-autosign></ls-field-properties-autosign>');

    const element = await page.find('ls-field-properties-autosign');
    expect(element).toHaveClass('hydrated');
  });
});
