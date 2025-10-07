import { newE2EPage } from '@stencil/core/testing';

describe('ls-input-wrapper', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-input-wrapper></ls-input-wrapper>');

    const element = await page.find('ls-input-wrapper');
    expect(element).toHaveClass('hydrated');
  });
});
