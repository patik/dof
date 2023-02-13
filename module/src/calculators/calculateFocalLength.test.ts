import { calculateFocalLength } from './calculateFocalLength'

describe('Calculating the depth of field with calculateFocalLength()', () => {
    describe('metric units (meters)', () => {
        test('35mm, f/2, crop factor of 1, 5 meters', () => {
            const result = calculateFocalLength({
                near: 4.021931840567339,
                aperture: 2,
                cropFactor: 1,
                distance: 5,
                imperialUnits: false,
            })

            expect(result.focalLength).toBe(35)
        })

        test('50mm, f/1.4, crop factor of 2, 25 meters', () => {
            const result = calculateFocalLength({
                near: 20.63203625607849,
                aperture: 1.414214,
                cropFactor: 2,
                distance: 25,
                imperialUnits: false,
            })

            expect(result.focalLength).toBe(50)
        })

        test('28mm, f/5, crop factor of 3.02, 7 meters', () => {
            // Blackmagic Cine Cam sensor
            const result = calculateFocalLength({
                near: 4.833680315786585,
                aperture: 5.039684,
                cropFactor: 3.02,
                distance: 7,
                imperialUnits: false,
            })

            expect(result.focalLength).toBe(28)
        })

        test('such that the far end of the range is infinity', () => {
            const result = calculateFocalLength({
                near: 0.9715025906735751,
                aperture: 16,
                cropFactor: 1,
                distance: 5,
                imperialUnits: false,
            })

            expect(result.focalLength).toBe(24)
        })
    })

    describe('imperial units (feet)', () => {
        test('35mm, f/2, crop factor of 1, 15 feet', () => {
            const result = calculateFocalLength({
                near: 12.27274548830499,
                aperture: 2,
                cropFactor: 1,
                distance: 15,
                imperialUnits: true,
            })

            expect(result.focalLength).toBe(35)
        })

        test('55mm, f/3.2, crop factor of 2.7, 42 feet', () => {
            const result = calculateFocalLength({
                near: 36.61227928000945,
                aperture: 3.174802,
                cropFactor: 2.7,
                distance: 42,
                imperialUnits: true,
            })

            expect(result.focalLength).toBe(55)
        })
    })
})
