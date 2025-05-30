import { newE2EPage } from '@stencil/core/testing';

describe('ls-toolbox-field', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-toolbox-field></ls-toolbox-field>');

    const element = await page.find('ls-toolbox-field');
    expect(element).toHaveClass('hydrated');
  });
});
