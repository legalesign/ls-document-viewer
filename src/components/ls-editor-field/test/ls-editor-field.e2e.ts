import { newE2EPage } from '@stencil/core/testing';

describe('ls-editor-field', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-editor-field></ls-editor-field>');

    const element = await page.find('ls-editor-field');
    expect(element).toHaveClass('hydrated');
  });
});
