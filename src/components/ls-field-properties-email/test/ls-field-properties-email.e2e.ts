import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-email', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-email></ls-field-properties-email>');

    const element = await page.find('ls-field-properties-email');
    expect(element).toHaveClass('hydrated');
  });
});
