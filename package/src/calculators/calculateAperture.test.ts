import { calculateAperture } from './calculateAperture'

describe('Calculating the aperture with calculateAperture()', () => {
    describe('metric units (meters)', () => {
        test('DoF 2.6 meters, 35mm, f/2, crop factor of 1, 5 meters', () => {
            const result = calculateAperture({
                focalLength: 35,
                cropFactor: 1,
                distance: 5,
                dof: 2.584690961719362,
                near: 4.021931840567339,
                imperialUnits: false,
            })

            expect(result.aperture).toBeCloseTo(2, 10)
            expect(result.fStop).toBe('f/2')
        })

        test('DoF 11 meters, 50mm, f/1.4, crop factor of 2, 25 meters', () => {
            const result = calculateAperture({
                focalLength: 50,
                cropFactor: 2,
                distance: 25,
                dof: 11.082093523926748,
                near: 20.63203625607849,
                imperialUnits: false,
            })

            expect(result.aperture).toBeCloseTo(1.414214, 6)
            expect(result.fStop).toBe('f/1.4')
        })

        test('DoF 7.9 meters, 28mm, f/5, crop factor of 3.02, 7 meters', () => {
            // Blackmagic Cine Cam sensor
            const result = calculateAperture({
                focalLength: 28,
                cropFactor: 3.02,
                distance: 7,
                dof: 7.851429380291624,
                near: 4.833680315786585,
                imperialUnits: false,
            })

            expect(result.aperture).toBeCloseTo(5.039684, 6)
            expect(result.fStop).toBe('f/5')
        })

        test('such that the far end of the range is infinity', () => {
            const result = calculateAperture({
                focalLength: 24,
                cropFactor: 1,
                distance: 5,
                dof: Infinity,
                near: 0.9715025906735751,
                imperialUnits: false,
            })

            expect(result.aperture).toBeCloseTo(16, 10)
            expect(result.fStop).toBe('f/16')
        })
    })

    describe('imperial units (feet)', () => {
        test('DoF 7 feet, 35mm, f/2, crop factor of 1, 15 feet', () => {
            const result = calculateAperture({
                focalLength: 35,
                cropFactor: 1,
                distance: 15,
                dof: 7.012923816256398,
                near: 12.27274548830499,
                imperialUnits: true,
            })

            expect(result.aperture).toBeCloseTo(2, 10)
            expect(result.fStop).toBe('f/2')
        })

        test('DoF 12.6 feet, 55mm, f/3.2, crop factor of 2.7, 42 feet', () => {
            const result = calculateAperture({
                focalLength: 55,
                cropFactor: 2.7,
                distance: 42,
                dof: 12.634717336600715,
                near: 36.61227928000945,
                imperialUnits: true,
            })

            expect(result.aperture).toBeCloseTo(3.174802, 6)
            expect(result.fStop).toBe('f/3.2')
        })
    })

    describe('invalid input', () => {
        const valid = {
            focalLength: 35,
            cropFactor: 1,
            dof: 2.584690961719362,
            near: 4.021931840567339,
            distance: 5,
        }

        test.each([
            ['a zero focal length', { focalLength: 0 }],
            ['a zero crop factor', { cropFactor: 0 }],
            ['a negative distance', { distance: -5 }],
            ['a NaN near limit', { near: Number.NaN }],
            ['a NaN depth of field', { dof: Number.NaN }],
            ['a near limit beyond the subject', { near: 6 }],
            ['a far limit in front of the subject', { near: 1, dof: 0.5 }],
        ])('throws for %s', (_label, override) => {
            expect(() => calculateAperture({ ...valid, ...override })).toThrow(RangeError)
        })
    })
})
