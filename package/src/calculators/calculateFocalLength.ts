import type { CalculateFocalLengthOptions, FocalLengthResult } from '../types'
import { decimalAdjust } from '../utilities/decimalAdjust'
import { toMillimeters } from '../utilities/units'
import { assertFinitePositive, assertNearLimit } from '../utilities/validate'

/**
 * Returns the focal length for a given lens' attributes and depth of field
 *
 * Only the near limit is needed, so this works whether or not the far limit reaches infinity. The result is rounded to
 * a whole millimeter: the inverse is sensitive enough that the extra digits would be noise rather than precision.
 */
export function calculateFocalLength({
    near,
    aperture,
    cropFactor,
    distance,
    imperialUnits = false,
}: CalculateFocalLengthOptions): FocalLengthResult {
    assertFinitePositive('aperture', aperture)
    assertFinitePositive('cropFactor', cropFactor)
    assertFinitePositive('distance', distance)
    assertFinitePositive('near', near)
    assertNearLimit(near, distance)

    // Convert to millimeters
    const mmDist = toMillimeters(distance, imperialUnits)
    const mmNear = toMillimeters(near, imperialUnits)

    const cropMultiplier = 1 / cropFactor
    const coc = Math.round(0.03 * cropMultiplier * 1000) / 1000

    const focalLength = Math.round(
        (mmNear * aperture * coc -
            Math.sqrt(
                mmNear ** 2 * aperture ** 2 * coc ** 2 - 4 * mmNear * mmDist * aperture * coc * (mmNear - mmDist),
            )) /
            (2 * (mmNear - mmDist)),
    )

    const result = {
        focalLength,
        focalLengthEquiv: decimalAdjust(cropFactor * focalLength),
    }

    return result
}
