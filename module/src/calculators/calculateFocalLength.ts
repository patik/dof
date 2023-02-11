import { decimalAdjust } from '../utilities/decimalAdjust'

/**
 * Returns the focal length for a given lens' attributes and depth of field
 */
export function calculateFocalLength({
    nearLimit,
    aperture,
    cropFactor,
    distance,
    imperialUnits,
}: {
    nearLimit: number
    aperture: number
    cropFactor: number
    distance: number
    imperialUnits: boolean
}): FocalLengthResult {
    // e.g. 1 foot is 30.48% of 1 meter
    const unitMultiplier = imperialUnits ? 0.3048 : 1

    // Convert to millimeters
    const mmDist = distance * 1000 * unitMultiplier
    const mmNear = nearLimit * 1000 * unitMultiplier

    const cropMultiplier = 1 / cropFactor
    const coc = Math.round(0.03 * cropMultiplier * 1000) / 1000

    const focalLength = Math.round(
        (mmNear * aperture * coc -
            Math.sqrt(
                Math.pow(mmNear, 2) * Math.pow(aperture, 2) * Math.pow(coc, 2) -
                    4 * mmNear * mmDist * aperture * coc * (mmNear - mmDist)
            )) /
            (2 * (mmNear - mmDist))
    )

    const result = {
        focalLength,
        focalLengthEquiv: decimalAdjust(cropFactor * focalLength),
    }

    return result
}
