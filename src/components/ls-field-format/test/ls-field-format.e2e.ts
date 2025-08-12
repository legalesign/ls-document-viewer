import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-format', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-format></ls-field-format>');

    const element = await page.find('ls-field-format');
    expect(element).toHaveClass('hydrated');
  });
});
