import { expect, test } from '@playwright/test'

for (const { path, canonical } of [
    { path: '/about/', canonical: 'https://patik.com/dof/about/' },
    { path: '/software/', canonical: 'https://patik.com/dof/software/' },
]) {
    test(`${path} has route-specific canonical metadata`, async ({ page }) => {
        await page.goto(path)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical)
    })
}

test('build includes an indexable-safe static 404 page', async ({ request }) => {
    const response = await request.get('/404.html')
    const html = await response.text()

    expect(response.ok()).toBe(true)
    expect(html).toContain('<h1>Page not found</h1>')
    expect(html).toContain('<meta name="robots" content="noindex">')
    expect(html).not.toContain('rel="canonical"')
})
