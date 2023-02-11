import { calculateAperture } from './calculateAperture'

describe('Calculating the depth of field with calculateDepthOfField', () => {
    describe('metric units (meters)', () => {
        test('DoF 2.584690961719362 meters, 35mm, f/2, crop factor of 1, 5 meters', () => {
            const result = calculateAperture(35, 1, 5, 2.584690961719362, 4.021931840567339, false)

            expect(result.aperture).toBe(2)
        })

        test('DoF 11.082093523926748 meters, 50mm, f/1.4, crop factor of 2, 25 meters', () => {
            const result = calculateAperture(50, 2, 25, 11.082093523926748, 20.63203625607849, false)

            expect(result.aperture).toBe(1.4142139999999992)
        })

        test('DoF 7.851429380291624 meters, 28mm, f/5, crop factor of 3.02, 7 meters', () => {
            // Blackmagic Cine Cam sensor
            const result = calculateAperture(28, 3.02, 7, 7.851429380291624, 4.833680315786585, false)

            expect(result.aperture).toBe(5.039684)
        })

        test('such that the far end of the range is infinity', () => {
            const result = calculateAperture(24, 1, 5, Infinity, 0.9715025906735751, false)

            expect(result.aperture).toBe(NaN)
        })
    })

    describe('imperial units (feet)', () => {
        test('DoF 7.012923816256398 feet, 35mm, f/2, crop factor of 1, 15 feet', () => {
            const result = calculateAperture(35, 1, 15, 7.012923816256398, 12.27274548830499, true)

            expect(result.aperture).toBe(2.000000000000001)
        })

        test('DoF 12.634717336600715 feet, 55mm, f/3.2, crop factor of 2.7, 42 feet', () => {
            const result = calculateAperture(55, 2.7, 42, 12.634717336600715, 36.61227928000945, true)

            expect(result.aperture).toBe(3.1748020000000055)
        })
    })
})
