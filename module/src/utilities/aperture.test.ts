import { builtInDefaults } from '../Lens'
import { getApertureName, toActualAperture } from './aperture'
import { preciseApertureMap } from '../data/preciseApertureMap'
import { objectKeysArray } from './objectKeysArray'

const defaultOptionsAperture = builtInDefaults.aperture
const defaultOptionsApertureNumber = Number(builtInDefaults.aperture.replace('f/', ''))

const customSettingsApertures = [undefined, 2.4, 'f/3.4']

describe.each(customSettingsApertures)('toActualAperture', (customSettingsAperture) => {
    describe(`customSettingsAperture: ${customSettingsAperture}`, () => {
        if (customSettingsAperture) {
            test('invalid string format is ignored and replaced with the custom value', () => {
                const expectedValue =
                    customSettingsAperture === 2.4
                        ? 2.378414
                        : customSettingsAperture === 'f/3.4'
                        ? 3.363586
                        : undefined

                // Verify the test setup
                expect(expectedValue).not.toBeUndefined()

                // Run the test
                expect(toActualAperture({ input: 'ff//2', customSettingsAperture, defaultOptionsAperture })).toBe(
                    expectedValue
                )
            })
        } else {
            test('invalid string format is ignored and replaced with the default value', () => {
                expect(toActualAperture({ input: 'ff//2', customSettingsAperture, defaultOptionsAperture })).toBe(
                    defaultOptionsApertureNumber
                )
            })

            test('a normal-looking value that is undocumented will be replaced with the default', () => {
                expect(toActualAperture({ input: 'f/3.57', customSettingsAperture, defaultOptionsAperture })).toBe(2)
            })
        }

        test('undefined input value is replaced with the default value', () => {
            expect(toActualAperture({ defaultOptionsAperture })).toBe(2)
            expect(toActualAperture({ customSettingsAperture: 2.4, defaultOptionsAperture })).toBe(2.378414)
            expect(toActualAperture({ customSettingsAperture: 'f/3.6', defaultOptionsAperture })).toBe(3.563595)
        })

        test('normal value, integer', () => {
            expect(toActualAperture({ input: 'f/2', customSettingsAperture, defaultOptionsAperture })).toBe(2)
            expect(toActualAperture({ input: 2, customSettingsAperture, defaultOptionsAperture })).toBe(2)
        })

        test('normal value, float', () => {
            expect(toActualAperture({ input: 'f/3.4', customSettingsAperture, defaultOptionsAperture })).toBe(3.363586)
        })

        test('smaller than any value in our aperture map', () => {
            expect(toActualAperture({ input: 'f/0.95', customSettingsAperture, defaultOptionsAperture })).toBe(0.95)
            expect(toActualAperture({ input: 0.75, customSettingsAperture, defaultOptionsAperture })).toBe(0.75)
        })

        test('larger than any value in our aperture map', () => {
            expect(toActualAperture({ input: 'f/128', customSettingsAperture, defaultOptionsAperture })).toBe(128)
            expect(toActualAperture({ input: 205, customSettingsAperture, defaultOptionsAperture })).toBe(205)
        })
    })
})

describe('getApertureName', () => {
    describe.each(objectKeysArray(preciseApertureMap))('Verify every value in the mapping', (fstop) => {
        test(`${preciseApertureMap[fstop]} -> ${fstop}`, () => {
            expect(getApertureName(preciseApertureMap[fstop])).toBe(fstop)
        })

        test(`1% below the documented value still finds the applicable f-stop: ${
            preciseApertureMap[fstop] * 0.99
        } -> ${fstop}`, () => {
            expect(getApertureName(preciseApertureMap[fstop] * 0.99)).toBe(fstop)
        })

        test(`1% above the documented value still finds the applicable f-stop: ${
            preciseApertureMap[fstop] * 1.01
        } -> ${fstop}`, () => {
            expect(getApertureName(preciseApertureMap[fstop] * 1.01)).toBe(fstop)
        })
    })

    test(`Documented value 5.039684 results in the value it's mapped to, f/5`, () => {
        expect(getApertureName(5.039684)).toBe('f/5')
    })

    test(`Undocumented value 5.01 results in the nearest aperture, f/5`, () => {
        expect(getApertureName(5.01)).toBe('f/5')
    })

    test(`Undocumented value 4.99 results in the nearest aperture, f/5`, () => {
        expect(getApertureName(4.99)).toBe('f/5')
    })
})
