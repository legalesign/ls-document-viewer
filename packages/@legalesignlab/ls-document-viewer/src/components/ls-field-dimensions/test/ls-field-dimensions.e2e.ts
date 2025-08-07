import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-dimensions', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-dimensions></ls-field-dimensions>');

    const element = await page.find('ls-field-dimensions');
    expect(element).toHaveClass('hydrated');
  });
});
