import { calculateCropFactor } from './calculateCropFactor'

describe('Calculating the depth of field with calculateCropFactor()', () => {
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
})
