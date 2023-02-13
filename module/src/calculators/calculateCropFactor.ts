import { toMillimeters } from '../utilities/units'

/**
 * Returns the depth of field characteristics for a given lens' attributes
 *
 * @param focalLength
 * @param aperture
 * @param cropFactor
 * @param distance
 * @param imperialUnits
 */
export function calculateCropFactor({
    nearLimit,
    dof,
    focalLength,
    aperture,
    distance,
    imperialUnits,
}: {
    nearLimit: number
    dof: number
    focalLength: number
    aperture: number
    distance: number
    imperialUnits: boolean
}): CropFactorResult {
    const mmDist = toMillimeters(distance, imperialUnits)
    const mmDof = toMillimeters(dof, imperialUnits)
    const mmNear = toMillimeters(nearLimit, imperialUnits)

    const mmFar = mmNear + mmDof
    const mmHF = (-1 * mmDist * focalLength + mmDist * mmFar) / (-1 * mmDist + mmFar)
    const coc = Math.pow(focalLength, 2) / (aperture * mmHF - aperture * focalLength)
    const cropMultiplier = (100 * coc) / 3
    const cropFactor = Math.round((1 / cropMultiplier) * 1000) / 1000

    return { cropFactor }
}
