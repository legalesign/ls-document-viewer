import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-container></ls-field-properties-container>');

    const element = await page.find('ls-field-properties-container');
    expect(element).toHaveClass('hydrated');
  });
});
