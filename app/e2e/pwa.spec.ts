import { expect, test } from '@playwright/test'

test('publishes an installable manifest and serves the app shell offline', async ({ context, page }) => {
    await page.goto('/')

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href')
    expect(manifestHref).toBe('/manifest.webmanifest')

    await page.evaluate(async () => {
        await navigator.serviceWorker.ready
    })
    await page.reload()
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)

    await context.setOffline(true)
    try {
        await page.reload({ waitUntil: 'domcontentloaded' })
        await expect(
            page.getByRole('heading', { name: 'Depth of Field Calculator & Lens Comparison Tool' }),
        ).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Depth across distance' })).toBeVisible()
    } finally {
        await context.setOffline(false)
    }
})
