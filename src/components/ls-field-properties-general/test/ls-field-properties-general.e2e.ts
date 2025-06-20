import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-properties-general', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-properties-general></ls-field-properties-general>');

    const element = await page.find('ls-field-properties-general');
    expect(element).toHaveClass('hydrated');
  });
});
