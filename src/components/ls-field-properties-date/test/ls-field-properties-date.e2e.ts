import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-date', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-date></ls-field-properties-date>');

    const element = await page.find('ls-field-properties-date');
    expect(element).toHaveClass('hydrated');
  });
});
