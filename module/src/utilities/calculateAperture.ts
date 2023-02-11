import { getApertureName } from './aperture'

/**
 * Returns the aperture for a given lens' attributes and depth of field
 */
export function calculateAperture({
    focalLength,
    cropFactor,
    distance,
    dof,
    nearLimit,
    imperialUnits,
}: {
    focalLength: number
    cropFactor: number
    distance: number
    dof: number
    nearLimit: number
    imperialUnits?: boolean
}): ApertureResult {
    // e.g. 1 foot is 30.48% of 1 meter
    const unitMultiplier = imperialUnits ? 0.3048 : 1

    // Convert to millimeters
    const mmDist = distance * 1000 * unitMultiplier
    const mmDof = dof * 1000 * unitMultiplier
    const mmNear = nearLimit * 1000 * unitMultiplier
    const mmFar = mmNear + mmDof
    const mmHF = (-1 * mmDist * focalLength + mmDist * mmFar) / (-1 * mmDist + mmFar)
    const cropMultiplier = 1 / cropFactor
    const coc = Math.round(0.03 * cropMultiplier * 1000) / 1000
    const aperture = Math.pow(focalLength, 2) / (coc * mmHF - coc * focalLength)

    const result: ApertureResult = {
        aperture,
        fStop: getApertureName(aperture),
    }

    return result
}
