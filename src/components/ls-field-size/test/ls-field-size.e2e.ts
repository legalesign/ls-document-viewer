import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-size', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-size></ls-field-size>');

    const element = await page.find('ls-field-size');
    expect(element).toHaveClass('hydrated');
  });
});
