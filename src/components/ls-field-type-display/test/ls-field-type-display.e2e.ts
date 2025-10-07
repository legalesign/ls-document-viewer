import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-type-display', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-type-display></ls-field-type-display>');

    const element = await page.find('ls-field-type-display');
    expect(element).toHaveClass('hydrated');
  });
});
