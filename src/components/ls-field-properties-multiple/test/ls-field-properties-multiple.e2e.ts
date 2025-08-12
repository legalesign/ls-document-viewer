import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-multiple', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-multiple></ls-field-properties-multiple>');

    const element = await page.find('ls-field-properties-multiple');
    expect(element).toHaveClass('hydrated');
  });
});
