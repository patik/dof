import { getApertureName } from '../utilities/aperture'
import { toMillimeters } from '../utilities/units'

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
    const mmDist = toMillimeters(distance, imperialUnits)
    const mmDof = toMillimeters(dof, imperialUnits)
    const mmNear = toMillimeters(nearLimit, imperialUnits)

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
