import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.addInitScript(() => {
        if (!sessionStorage.getItem('chart-test-initialized')) {
            localStorage.removeItem('dof-chart-scale:v1')
            localStorage.removeItem('dof-theme')
            sessionStorage.setItem('chart-test-initialized', 'true')
        }
    })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Depth across distance' })).toBeVisible()
})

test('renders the responsive lens chart', async ({ page }) => {
    const chart = page.getByRole('region', { name: 'Depth across distance' })

    await expect(chart.getByRole('img')).toHaveAccessibleName(/A linear scale line chart comparing 2 lenses/)
    await expect(chart).toHaveScreenshot('depth-chart-linear.png', {
        animations: 'disabled',
    })
})

test('persists the log scale and exposes the nearest point tooltip', async ({ page }) => {
    const chart = page.getByRole('region', { name: 'Depth across distance' })
    const logButton = chart.getByRole('button', { name: 'log' })

    await logButton.click()
    await expect(logButton).toHaveAttribute('aria-pressed', 'true')

    const pointerArea = page.getByTestId('chart-pointer-area')
    const bounds = await pointerArea.boundingBox()
    expect(bounds).not.toBeNull()
    if (!bounds) {
        return
    }

    await pointerArea.hover({ position: { x: bounds.width * 0.45, y: bounds.height * 0.55 } })
    await expect(chart.getByRole('status')).toContainText('DoF is')
    await expect(chart.getByRole('status')).toContainText('for a subject that is')

    await page.reload()
    await expect(chart.getByRole('button', { name: 'log' })).toHaveAttribute('aria-pressed', 'true')
})
