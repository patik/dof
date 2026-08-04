import { expect, test } from '@playwright/test'

test('styles the initial shell before JavaScript loads', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    await context.route('**/*.css', (route) => route.abort())
    const page = await context.newPage()

    await page.goto('/')

    const shell = page.locator('.initial-shell')
    await expect(shell).toBeVisible()
    await expect(page.locator('.initial-brand')).toContainText('Optical field notes')

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
