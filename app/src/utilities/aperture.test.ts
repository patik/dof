import { builtInDefaults } from '../Lens'
import { toActualAperture } from './aperture'

const defaultOptionsAperture = builtInDefaults.aperture
const defaultOptionsApertureNumber = Number(builtInDefaults.aperture.replace('f/', ''))

describe('toActualAperture', () => {
    test('invalid string format is ignored and replaced with the default value', () => {
        expect(toActualAperture({ input: 'ff//2', defaultOptionsAperture })).toBe(defaultOptionsApertureNumber)
    })

    test('normal value, integer', () => {
        expect(toActualAperture({ input: 'f/2', defaultOptionsAperture })).toBe(2)
    })

    test('normal value, float', () => {
        expect(toActualAperture({ input: 'f/3.4', defaultOptionsAperture })).toBe(3.363586)
    })

    test('smaller than any value in our aperture map', () => {
        expect(toActualAperture({ input: 'f/0.95', defaultOptionsAperture })).toBe(0.95)
    })

    test('larger than any value in our aperture map', () => {
        expect(toActualAperture({ input: 'f/128', defaultOptionsAperture })).toBe(128)
    })
})
