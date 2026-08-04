import { expect, test } from '@playwright/test'

test('styles the initial shell before JavaScript loads', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    await context.route('**/*.css', (route) => route.abort())
    const page = await context.newPage()

    await page.goto('/')

    const shell = page.locator('.initial-shell')
    await expect(shell).toBeVisible()
    await expect(page.locator('.initial-iris')).toBeVisible()

    const criticalStyles = await shell.evaluate((element) => ({
        bodyBackground: getComputedStyle(document.body).backgroundColor,
        bodyFont: getComputedStyle(document.body).fontFamily,
        maxWidth: getComputedStyle(element).maxWidth,
    }))

    expect(criticalStyles).toEqual({
        bodyBackground: 'rgb(246, 241, 232)',
        bodyFont: '"Archivo Variable", "Helvetica Neue", sans-serif',
        maxWidth: '1020px',
    })

    await context.close()
})

test('uses the system theme and persists a manual override', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.addInitScript(() => {
        if (!sessionStorage.getItem('theme-test-initialized')) {
            localStorage.removeItem('dof-theme')
            sessionStorage.setItem('theme-test-initialized', 'true')
        }
    })
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.getByRole('button', { name: 'Use dark theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('button', { name: 'Use light theme' })).toBeVisible()
})

test('follows system theme changes until the user chooses an override', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.addInitScript(() => localStorage.removeItem('dof-theme'))
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await page.evaluate(() => localStorage.getItem('dof-theme'))).toBeNull()

    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await page.evaluate(() => localStorage.getItem('dof-theme'))).toBeNull()
})

for (const path of ['/about/', '/software/']) {
    test(`${path} uses the shared heading hierarchy`, async ({ page }) => {
        await page.goto(path)

        const h1 = page.locator('h1').first()
        const h2 = page.locator('h2').first()
        const [h1Styles, h2Styles] = await Promise.all([
            h1.evaluate((element) => ({
                family: getComputedStyle(element).fontFamily,
                size: Number.parseFloat(getComputedStyle(element).fontSize),
            })),
            h2.evaluate((element) => ({
                family: getComputedStyle(element).fontFamily,
                size: Number.parseFloat(getComputedStyle(element).fontSize),
            })),
        ])

        expect(h1Styles.family).toBe('"Newsreader Variable", serif')
        expect(h2Styles.family).toBe(h1Styles.family)
        expect(h2Styles.size).toBeLessThan(h1Styles.size)

        if (path === '/software/') {
            const h3Size = await page
                .locator('h3')
                .first()
                .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))

            expect(h3Size).toBeLessThan(h2Styles.size)
            await expect(page.getByRole('link', { name: 'Depth of Field Calculator home' })).toBeVisible()
        }
    })
}
