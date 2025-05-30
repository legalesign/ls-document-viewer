import { newE2EPage } from '@stencil/core/testing';

describe('ls-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<ls-editor></ls-editor>');
    const element = await page.find('ls-editor');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<ls-editor></ls-editor>');
    const component = await page.find('ls-editor');
    const element = await page.find('ls-editor >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('templateTitle', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

  });
});
