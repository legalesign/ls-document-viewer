import { newE2EPage } from '@stencil/core/testing';

describe('ls-document-options', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-document-options></ls-document-options>');

    const element = await page.find('ls-document-options');
    expect(element).toHaveClass('hydrated');
  });
});
