import { expect, type Locator, type Page, test } from '@playwright/test'

async function resetToSingleLens(page: Page) {
    await page.goto('/')
    await page.getByRole('button', { name: 'Add Lens' }).click()
    await page.getByTestId('select-all').click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Add Lens' }).click()
}

async function fillLastInput(page: Page, testId: RegExp, value: string) {
    await page.getByTestId(testId).last().locator('input').fill(value)
}

async function selectLastOption(page: Page, testId: RegExp, optionName: string) {
    await page.getByTestId(testId).last().click()
    await page.getByRole('option', { name: optionName, exact: true }).click()
}

function lastDepthOfField(page: Page): Locator {
    return page.getByTestId(/^dof-/).last()
}

test('removes all existing lenses', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Add Lens' }).click()
    await expect(page.getByTestId(/^lens-name-/)).not.toHaveCount(0)

    await page.getByTestId('select-all').click()
    await expect(page.getByTestId('selected-count')).toContainText(/\d+ selected/)
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByTestId(/^lens-name-/)).toHaveCount(0)
})

test('updates the metric depth of field when lens inputs change', async ({ page }) => {
    await resetToSingleLens(page)
    await page.locator('button[value="metric"]').click()
    await expect(lastDepthOfField(page)).not.toHaveText('0.61')

    await fillLastInput(page, /^focal-length-/, '72')
    await selectLastOption(page, /^aperture-/, 'f/3.4')
    await selectLastOption(page, /^sensor-/, 'Nikon D3100/D3200')

    await expect(lastDepthOfField(page)).toHaveText('0.61')
    await page.getByRole('button', { name: 'expand row' }).last().click()
    await expect(page.getByRole('table', { name: 'depth of field details' })).toBeVisible()
    await expect(page.getByTestId('dof-precise').last()).toHaveText('0.6097723318293538')
})

test('updates the imperial depth of field when lens inputs change', async ({ page }) => {
    await resetToSingleLens(page)
    await page.locator('button[value="imperial"]').click()
    await expect(lastDepthOfField(page)).not.toHaveText(`0' 2 1/4"`)

    await fillLastInput(page, /^focal-length-/, '90')
    await selectLastOption(page, /^aperture-/, 'f/4')
    await selectLastOption(page, /^sensor-/, 'iPhone 13 (2021)')

    await expect(lastDepthOfField(page)).toHaveText(`0' 2 1/4"`)
    await page.getByRole('button', { name: 'expand row' }).last().click()
    await expect(page.getByRole('table', { name: 'depth of field details' })).toBeVisible()
    await expect(page.getByTestId('dof-precise').last()).toHaveText('0.05665367011304934')
})

test('updates the metric depth of field when distance changes', async ({ page }) => {
    await resetToSingleLens(page)
    await page.locator('button[value="metric"]').click()
    await page.getByTestId('distance').locator('input').fill('10')

    await expect(lastDepthOfField(page)).toHaveText('12.81')
    await page.getByRole('button', { name: 'expand row' }).last().click()
    await expect(page.getByTestId('dof-precise').last()).toHaveText('12.81430309460011')
})

test('updates the imperial depth of field when distance changes', async ({ page }) => {
    await resetToSingleLens(page)
    await page.locator('button[value="imperial"]').click()
    await page.getByTestId('distance').locator('input').fill('10')

    await expect(lastDepthOfField(page)).toHaveText(`9' 10 3/4"`)
    await page.getByRole('button', { name: 'expand row' }).last().click()
    await expect(page.getByTestId('dof-precise').last()).toHaveText('3.0172208423706834')
})

test('adds another lens', async ({ page }) => {
    await page.goto('/')
    const lenses = page.getByTestId(/^lens-name-/)
    const initialCount = await lenses.count()

    await page.getByRole('button', { name: 'Add Lens' }).click()
    await expect(lenses).toHaveCount(initialCount + 1)
})

test('duplicates a lens with the same values', async ({ page }) => {
    await resetToSingleLens(page)
    await page.locator('button[value="metric"]').click()
    await fillLastInput(page, /^lens-name-/, 'Sieben-Eins')
    await fillLastInput(page, /^focal-length-/, '20')
    await selectLastOption(page, /^aperture-/, 'f/1.4')
    await selectLastOption(page, /^sensor-/, 'Standard 16mm film')
    await expect(lastDepthOfField(page)).toHaveText('1.63')

    const original = page.getByTestId(/^lens-name-/).last()
    const originalTestId = await original.getAttribute('data-testid')
    const originalId = originalTestId?.replace(/^lens-name-/, '')

    expect(originalId).toBeTruthy()
    await page.getByTestId(`lens-checkbox-${originalId}`).click()
    await page.getByRole('button', { name: 'Duplicate' }).click()

    const duplicate = page.getByTestId(/^lens-name-/).last()
    const duplicateTestId = await duplicate.getAttribute('data-testid')
    const duplicateId = duplicateTestId?.replace(/^lens-name-/, '')

    expect(duplicateId).toBeTruthy()
    await expect(page.getByTestId(`lens-name-${duplicateId}`).locator('input')).toHaveValue('Sieben-Eins copy')
    await expect(page.getByTestId(`focal-length-${duplicateId}`).locator('input')).toHaveValue('20')
    await expect(page.getByTestId(`aperture-${duplicateId}`)).toContainText('f/1.4')
    await expect(page.getByTestId(`sensor-${duplicateId}`)).toContainText('Standard 16mm film')
    await expect(page.getByTestId(`dof-${duplicateId}`)).toContainText('1.63')
    await expect(
        page
            .getByTestId(/^lens-name-/)
            .first()
            .locator('input'),
    ).toHaveValue('Sieben-Eins')
})
