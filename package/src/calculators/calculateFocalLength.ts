import { decimalAdjust } from '../utilities/decimalAdjust'
import { toMillimeters } from '../utilities/units'

/**
 * Returns the focal length for a given lens' attributes and depth of field
 */
export function calculateFocalLength({
    near,
    aperture,
    cropFactor,
    distance,
    imperialUnits,
}: {
    near: number
    aperture: number
    cropFactor: number
    distance: number
    imperialUnits: boolean
}): FocalLengthResult {
    // Convert to millimeters
    const mmDist = toMillimeters(distance, imperialUnits)
    const mmNear = toMillimeters(near, imperialUnits)

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
