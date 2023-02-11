import { decimalAdjust } from '../utilities/decimalAdjust'
import { formatFeet } from '../utilities/formatFeet'
import { fromMillimeters, toMillimeters } from '../utilities/units'

/**
 * Returns the depth of field characteristics for a given lens' attributes
 *
 * @param focalLength
 * @param aperture
 * @param cropFactor
 * @param distance
 * @param imperialUnits
 */
export function calculateDepthOfField({
    focalLength,
    aperture,
    cropFactor,
    distance,
    imperialUnits,
}: {
    focalLength: number
    aperture: number
    cropFactor: number
    distance: number
    imperialUnits: boolean
}): DoFResult {
    // Convert to millimeters
    const mmDist = toMillimeters(distance, imperialUnits)

    const cropMultiplier = 1 / cropFactor
    const coc = Math.round(0.03 * cropMultiplier * 1000) / 1000
    const mmHF = Math.pow(focalLength, 2) / (aperture * coc) + focalLength * 1.0
    const mmNear = (mmDist * (mmHF - focalLength)) / (mmHF + mmDist - 2 * focalLength)
    const mmFar = (mmDist * (mmHF - focalLength)) / (mmHF - mmDist)

    // Undo conversion to millimeters
    const near = fromMillimeters(mmNear, imperialUnits)
    const trueFar = fromMillimeters(mmFar, imperialUnits)

    const isInfinite = trueFar <= 0
    const dof = isInfinite ? Infinity : trueFar - near
    const far = isInfinite ? Infinity : trueFar

    const result: DoFResult = {
        dof,
        focalLengthEquiv: decimalAdjust(cropFactor * focalLength),
        eighthDof: dof / 8,
        hf: fromMillimeters(mmHF, imperialUnits),
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
