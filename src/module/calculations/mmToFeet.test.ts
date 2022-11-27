import { mmToFeet } from './mmToFeet'

describe('mmToFeet', () => {
    test('converts values correctly', () => {
        expect(mmToFeet(0)).toBe(`0' 0.0"`)
        expect(mmToFeet(1)).toBe(`0' 0.0"`)
        expect(mmToFeet(2)).toBe(`0' 0.1"`)
        expect(mmToFeet(1234)).toBe(`4' 0.6"`)
        expect(mmToFeet(Infinity)).toBe(`Infinity`)
    })
})
