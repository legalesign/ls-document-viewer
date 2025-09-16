import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-file', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-file></ls-field-properties-file>');

    const element = await page.find('ls-field-properties-file');
    expect(element).toHaveClass('hydrated');
  });
});
