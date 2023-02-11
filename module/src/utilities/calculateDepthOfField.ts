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

    // Convert sensor crop factor to a multiplier
    const sensorMultiplier = 1 / cropFactor

    const CoC = Math.round(0.03 * sensorMultiplier * 1000) / 1000

    const HF = Math.pow(focalLength, 2) / (aperture * CoC) + focalLength * 1.0
    const Near = (mmDist * (HF - focalLength)) / (HF + mmDist - 2 * focalLength)
    const Far = (mmDist * (HF - focalLength)) / (HF - mmDist)

    // Undo conversion to millimeters

    const unconvertedNear = Near / 1000.0 / unitMultiplier
    const unconvertedFar = Far / 1000.0 / unitMultiplier

    const isInfinite = unconvertedFar <= 0

    const dof = isInfinite ? Infinity : unconvertedFar - unconvertedNear

    const result: DoFResult = {
        dof,
        focalLengthEquiv,
        eighthDof: dof / 8,
        hf: HF / 1000.0 / unitMultiplier,
        near: unconvertedNear,
        far: isInfinite ? Infinity : unconvertedFar,
        coc: CoC,
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
