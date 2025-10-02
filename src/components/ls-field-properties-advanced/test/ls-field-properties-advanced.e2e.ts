import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-advanced', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-advanced></ls-field-properties-advanced>');

    const element = await page.find('ls-field-properties-advanced');
    expect(element).toHaveClass('hydrated');
  });
});
