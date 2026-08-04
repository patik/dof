import { calculateCropFactor } from './calculateCropFactor'

describe('Calculating the crop factor with calculateCropFactor()', () => {
    describe('metric units (meters)', () => {
        test('35mm, f/2, crop factor of 1, 5 meters', () => {
            const result = calculateCropFactor({
                dof: 2.584690961719362,
                near: 4.021931840567339,
                focalLength: 35,
                aperture: 2,
                distance: 5,
                imperialUnits: false,
            })

            expect(result.cropFactor).toBe(1)
        })

        test('50mm, f/1.4, crop factor of 2, 25 meters', () => {
            const result = calculateCropFactor({
                dof: 11.082093523926748,
                near: 20.63203625607849,
                focalLength: 50,
                aperture: 1.414214,
                distance: 25,
                imperialUnits: false,
            })

            expect(result.cropFactor).toBe(2)
        })

        test('28mm, f/5, crop factor of 3.02, 7 meters', () => {
            // Blackmagic Cine Cam sensor
            const result = calculateCropFactor({
                focalLength: 28,
                aperture: 5.039684,
                dof: 7.851429380291624,
                near: 4.833680315786585,
                distance: 7,
                imperialUnits: false,
            })

            expect(result.cropFactor).toBe(3)
        })

        test('such that the far end of the range is infinity', () => {
            const result = calculateCropFactor({
                focalLength: 24,
                aperture: 16,
                dof: Infinity,
                near: 0.9715025906735751,
                distance: 5,
                imperialUnits: false,
            })

            expect(result.cropFactor).toBe(1)
        })
    })

    describe('imperial units (feet)', () => {
        test('35mm, f/2, crop factor of 1, 15 feet', () => {
            const result = calculateCropFactor({
                focalLength: 35,
                aperture: 2,
                near: 12.27274548830499,
                dof: 7.012923816256398,
                distance: 15,
                imperialUnits: true,
            })

            expect(result.cropFactor).toBe(1)
        })

        test('55mm, f/3.2, crop factor of 2.7, 42 feet', () => {
            const result = calculateCropFactor({
                focalLength: 55,
                aperture: 3.174802,
                dof: 12.634717336600715,
                near: 36.61227928000945,
                distance: 42,
                imperialUnits: true,
            })

            expect(result.cropFactor).toBe(2.727)
        })
    })

    describe('invalid input', () => {
        const valid = {
            focalLength: 35,
            aperture: 2,
            dof: 2.584690961719362,
            near: 4.021931840567339,
            distance: 5,
        }

        test.each([
            ['a zero focal length', { focalLength: 0 }],
            ['a negative aperture', { aperture: -2 }],
            ['an infinite distance', { distance: Infinity }],
            ['a NaN near limit', { near: Number.NaN }],
            ['a zero depth of field', { dof: 0 }],
            ['a near limit beyond the subject', { near: 6 }],
            ['a far limit in front of the subject', { near: 1, dof: 0.5 }],
        ])('throws for %s', (_label, override) => {
            expect(() => calculateCropFactor({ ...valid, ...override })).toThrow(RangeError)
        })
    })
})
