import { expect, test } from '@playwright/test'

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
