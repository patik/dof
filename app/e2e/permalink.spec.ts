import { expect, test } from '@playwright/test'

test('adds the current comparison to a clean URL', async ({ page }) => {
    await page.goto('/')
    await expect(page).not.toHaveURL(/#/)
    await expect(page.getByTestId(/^lens-name-/)).toHaveCount(2)
    await page.getByRole('button', { name: 'Add Lens' }).click()
    await expect(page).toHaveURL(/#5,m;Lens%203,35,f-2,full$/)
})

for (const { name, hash, distance, units } of [
    { name: 'metric permalink', hash: '#23,m', distance: '23', units: 'metric' },
    { name: 'imperial permalink', hash: '#34,i', distance: '34', units: 'imperial' },
    { name: 'legacy permalink without units', hash: '#56', distance: '56', units: 'imperial' },
]) {
    test(`reads ${name}`, async ({ page }) => {
        await page.goto(`/${hash}`)
        await expect(page.getByTestId('distance').locator('input')).toHaveValue(distance)
        await expect(page.locator(`button[value="${units}"]`)).toHaveAttribute('aria-pressed', 'true')
        await expect(page.locator(`button[value="${units === 'metric' ? 'imperial' : 'metric'}"]`)).toHaveAttribute(
            'aria-pressed',
            'false',
        )
    })
}

test('reads a single lens from the initial hash', async ({ page }) => {
    await page.goto('/#5,m;Alpha%20bravo,20,f-3.6,16mm')

    await expect(
        page
            .getByTestId(/^lens-name-/)
            .first()
            .locator('input'),
    ).toHaveValue('Alpha bravo')
    await expect(
        page
            .getByTestId(/^focal-length-/)
            .first()
            .locator('input'),
    ).toHaveValue('20')
    await expect(page.getByTestId(/^aperture-/).first()).toContainText('f/3.6')
    await expect(page.getByTestId(/^sensor-/).first()).toContainText('Standard 16mm film')
    await expect(page.getByTestId(/^dof-/).first()).toContainText('4.75')
})

test('reads two lenses from the initial hash', async ({ page }) => {
    await page.goto('/#12,i;Alpha%20bravo,20,f-3.6,16mm;Charlie-Delta,55,f-5,iPhone14')

    await expect(
        page
            .getByTestId(/^lens-name-/)
            .first()
            .locator('input'),
    ).toHaveValue('Alpha bravo')
    await expect(
        page
            .getByTestId(/^focal-length-/)
            .first()
            .locator('input'),
    ).toHaveValue('20')
    await expect(page.getByTestId(/^aperture-/).first()).toContainText('f/3.6')
    await expect(page.getByTestId(/^sensor-/).first()).toContainText('Standard 16mm film')
    await expect(page.getByTestId(/^dof-/).first()).toContainText(`25' 1 1/4"`)

    await expect(
        page
            .getByTestId(/^lens-name-/)
            .last()
            .locator('input'),
    ).toHaveValue('Charlie-Delta')
    await expect(
        page
            .getByTestId(/^focal-length-/)
            .last()
            .locator('input'),
    ).toHaveValue('55')
    await expect(page.getByTestId(/^aperture-/).last()).toContainText('f/5')
    await expect(page.getByTestId(/^sensor-/).last()).toContainText('iPhone 14')
    await expect(page.getByTestId(/^dof-/).last()).toContainText(`4' 9"`)
})
