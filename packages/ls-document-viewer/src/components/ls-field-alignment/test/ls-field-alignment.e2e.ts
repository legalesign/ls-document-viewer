import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-alignment', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-alignment></ls-field-alignment>');

    const element = await page.find('ls-field-alignment');
    expect(element).toHaveClass('hydrated');
  });
});
