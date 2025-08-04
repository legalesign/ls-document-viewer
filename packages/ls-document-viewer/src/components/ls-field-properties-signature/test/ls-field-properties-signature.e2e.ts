import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-signature', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-signature></ls-field-properties-signature>');

    const element = await page.find('ls-field-properties-signature');
    expect(element).toHaveClass('hydrated');
  });
});
