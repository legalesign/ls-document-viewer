import { newE2EPage } from '@stencil/core/testing';

describe('ls-recipient-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-recipient-card></ls-recipient-card>');

    const element = await page.find('ls-recipient-card');
    expect(element).toHaveClass('hydrated');
  });
});
