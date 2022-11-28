import { feetToFloat } from './feetToFloat'

describe('feetToFloat', () => {
    test('converts values correctly', () => {
        expect(feetToFloat(`0' 0"`)).toBe(0)
        expect(feetToFloat(`0' 0.0"`)).toBe(0)
        expect(feetToFloat(`0'`)).toBe(0)
        expect(feetToFloat(`0' 6"`)).toBe(0.5)
        expect(feetToFloat(`1'`)).toBe(1)
        expect(feetToFloat(`10' 2.5"`)).toBe(10.208333333333334)
    })
})
