import {
    type CalculateApertureOptions,
    type CalculateCropFactorOptions,
    type CalculateDepthOfFieldOptions,
    type CalculateFocalLengthOptions,
    calculateAperture,
    calculateCropFactor,
    calculateDepthOfField,
    calculateFocalLength,
} from 'dof'

describe('standalone calculator package exports', () => {
    test('calculate values using the default metric units', () => {
        const depthOfFieldOptions: CalculateDepthOfFieldOptions = {
            focalLength: 35,
            aperture: 2,
            cropFactor: 1,
            distance: 5,
        }
        const depthOfField = calculateDepthOfField(depthOfFieldOptions)

        const apertureOptions: CalculateApertureOptions = {
            focalLength: 35,
            cropFactor: 1,
            distance: 5,
            dof: depthOfField.dof,
            near: depthOfField.near,
        }
        const aperture = calculateAperture(apertureOptions)

        const cropFactorOptions: CalculateCropFactorOptions = {
            focalLength: 35,
            aperture: 2,
            distance: 5,
            dof: depthOfField.dof,
            near: depthOfField.near,
        }
        const cropFactor = calculateCropFactor(cropFactorOptions)

        const focalLengthOptions: CalculateFocalLengthOptions = {
            aperture: 2,
            cropFactor: 1,
            distance: 5,
            near: depthOfField.near,
        }
        const focalLength = calculateFocalLength(focalLengthOptions)

        expect(aperture).toEqual({ aperture: 2, fStop: 'f/2' })
        expect(cropFactor).toEqual({ cropFactor: 1 })
        expect(focalLength).toEqual({ focalLength: 35, focalLengthEquiv: 35 })
    })
})
