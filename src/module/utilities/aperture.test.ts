import { getActualAperture } from './aperture'

describe('getActualAperture', () => {
    test('invalid string format', () => {
        expect(getActualAperture('ff//2')).toBeUndefined()
    })

    test('normal value', () => {
        expect(getActualAperture('f/2')).toBe(2)
    })
})
