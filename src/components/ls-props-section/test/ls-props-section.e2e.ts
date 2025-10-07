import { newE2EPage } from '@stencil/core/testing';

describe('ls-props-section', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-props-section></ls-props-section>');

    const element = await page.find('ls-props-section');
    expect(element).toHaveClass('hydrated');
  });
});
