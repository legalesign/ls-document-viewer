import { newE2EPage } from '@stencil/core/testing';

describe('ls-participant-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ls-participant-select></ls-participant-select>');

    const element = await page.find('ls-participant-select');
    expect(element).toHaveClass('hydrated');
  });
});
