import { newE2EPage } from '@stencil/core/testing';

describe('ls-feature-coloumn', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-feature-coloumn></ls-feature-coloumn>');

    const element = await page.find('ls-feature-coloumn');
    expect(element).toHaveClass('hydrated');
  });
});
