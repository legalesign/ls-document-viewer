import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-regex', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-regex></ls-field-properties-regex>');

    const element = await page.find('ls-field-properties-regex');
    expect(element).toHaveClass('hydrated');
  });
});
