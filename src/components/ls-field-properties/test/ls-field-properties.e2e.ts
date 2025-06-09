import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties></ls-field-properties>');

    const element = await page.find('ls-field-properties');
    expect(element).toHaveClass('hydrated');
  });
});
