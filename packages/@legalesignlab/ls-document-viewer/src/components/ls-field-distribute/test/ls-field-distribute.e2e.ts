import { newE2EPage } from '@stencil/core/testing';

describe('ls-field-distribute', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-field-distribute></ls-field-distribute>');

    const element = await page.find('ls-field-distribute');
    expect(element).toHaveClass('hydrated');
  });
});
