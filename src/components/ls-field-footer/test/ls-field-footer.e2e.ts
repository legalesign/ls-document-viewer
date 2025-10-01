import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-footer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-footer></ls-field-footer>');

    const element = await page.find('ls-field-footer');
    expect(element).toHaveClass('hydrated');
  });
});
