import { decimalAdjust } from './decimalAdjust'
import { formatFeet } from './formatFeet'

/**
 * Returns the depth of field characteristics for a given lens' attributes
 *
 * @param focalLength
 * @param aperture
 * @param cropFactor
 * @param distance
 * @param imperialUnits
 */
export function calculateDepthOfField(
    focalLength: number,
    aperture: number,
    cropFactor: number,
    distance: number,
    imperialUnits: boolean
): DoFResult {
    // e.g. 1 foot is 30.48% of 1 meter
    const unitMultiplier = imperialUnits ? 0.3048 : 1

    // Convert to millimeters
    const mmDist = distance * 1000 * unitMultiplier

    // Get 35mm-equivalent focal length
    const focalLengthEquiv = decimalAdjust(cropFactor * focalLength)

    const cropMultiplier = 1 / cropFactor
    const coc = Math.round(0.03 * cropMultiplier * 1000) / 1000
    const mmHF = Math.pow(focalLength, 2) / (aperture * coc) + focalLength * 1.0
    const mmNear = (mmDist * (mmHF - focalLength)) / (mmHF + mmDist - 2 * focalLength)
    const mmFar = (mmDist * (mmHF - focalLength)) / (mmHF - mmDist)

    // Undo conversion to millimeters

    const near = mmNear / 1000.0 / unitMultiplier
    const trueFar = mmFar / 1000.0 / unitMultiplier
    const isInfinite = trueFar <= 0
    const dof = isInfinite ? Infinity : trueFar - near
    const far = isInfinite ? Infinity : trueFar

    const result: DoFResult = {
        dof,
        focalLengthEquiv,
        eighthDof: dof / 8,
        hf: mmHF / 1000.0 / unitMultiplier,
        near,
        far,
        coc,
    }

    if (imperialUnits) {
        result.toString = function () {
            return formatFeet(dof)
        }
    } else {
        result.toString = function () {
            return `${dof}`
        }
    }

    return result
}
