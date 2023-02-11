import { calculateAperture } from './calculateAperture'

describe('Calculating the depth of field with calculateAperture()', () => {
    describe('metric units (meters)', () => {
        test('DoF 2.6 meters, 35mm, f/2, crop factor of 1, 5 meters', () => {
            const result = calculateAperture({
                focalLength: 35,
                cropFactor: 1,
                distance: 5,
                dof: 2.584690961719362,
                nearLimit: 4.021931840567339,
                imperialUnits: false,
            })

            expect(result.aperture).toBe(2)
        })

        test('DoF 11 meters, 50mm, f/1.4, crop factor of 2, 25 meters', () => {
            const result = calculateAperture({
                focalLength: 50,
                cropFactor: 2,
                distance: 25,
                dof: 11.082093523926748,
                nearLimit: 20.63203625607849,
                imperialUnits: false,
            })

            expect(result.aperture).toBe(1.4142139999999992)
        })

        test('DoF 7.9 meters, 28mm, f/5, crop factor of 3.02, 7 meters', () => {
            // Blackmagic Cine Cam sensor
            const result = calculateAperture({
                focalLength: 28,
                cropFactor: 3.02,
                distance: 7,
                dof: 7.851429380291624,
                nearLimit: 4.833680315786585,
                imperialUnits: false,
            })

            expect(result.aperture).toBe(5.039684)
        })

        test('such that the far end of the range is infinity', () => {
            const result = calculateAperture({
                focalLength: 24,
                cropFactor: 1,
                distance: 5,
                dof: Infinity,
                nearLimit: 0.9715025906735751,
                imperialUnits: false,
            })

            expect(result.aperture).toBe(NaN)
        })
    })

    describe('imperial units (feet)', () => {
        test('DoF 7 feet, 35mm, f/2, crop factor of 1, 15 feet', () => {
            const result = calculateAperture({
                focalLength: 35,
                cropFactor: 1,
                distance: 15,
                dof: 7.012923816256398,
                nearLimit: 12.27274548830499,
                imperialUnits: true,
            })

            expect(result.aperture).toBe(2.000000000000001)
        })

        test('DoF 12.6 feet, 55mm, f/3.2, crop factor of 2.7, 42 feet', () => {
            const result = calculateAperture({
                focalLength: 55,
                cropFactor: 2.7,
                distance: 42,
                dof: 12.634717336600715,
                nearLimit: 36.61227928000945,
                imperialUnits: true,
            })

            expect(result.aperture).toBe(3.1748020000000055)
        })
    })
})
