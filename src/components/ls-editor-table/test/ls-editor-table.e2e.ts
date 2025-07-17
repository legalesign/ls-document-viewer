import { newE2EPage } from '@stencil/core/testing';

describe('ls-editor-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-editor-table></ls-editor-table>');

    const element = await page.find('ls-editor-table');
    expect(element).toHaveClass('hydrated');
  });
});
