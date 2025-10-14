import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-dropdown', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-dropdown></ls-field-properties-dropdown>');

    const element = await page.find('ls-field-properties-dropdown');
    expect(element).toHaveClass('hydrated');
  });
});
