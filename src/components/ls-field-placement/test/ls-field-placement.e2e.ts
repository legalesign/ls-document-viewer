import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-placement', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-placement></ls-field-placement>');

    const element = await page.find('ls-field-placement');
    expect(element).toHaveClass('hydrated');
  });
});
