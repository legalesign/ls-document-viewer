import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-image', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-image></ls-field-properties-image>');

    const element = await page.find('ls-field-properties-image');
    expect(element).toHaveClass('hydrated');
  });
});
