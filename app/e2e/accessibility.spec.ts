import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const path of ['/', '/about/']) {
    test(`${path} has no serious or critical accessibility violations`, async ({ page }) => {
        await page.goto(path)
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
        const violations = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')

        expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    })
}
