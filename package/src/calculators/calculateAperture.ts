import type { ApertureResult, CalculateApertureOptions } from '../types'
import { getApertureName } from '../utilities/aperture'
import { hyperfocalFromDepthOfField } from '../utilities/hyperfocal'
import { toMillimeters } from '../utilities/units'
import { assertFarLimit, assertFinitePositive, assertNearLimit, assertPositiveOrInfinite } from '../utilities/validate'

/**
 * Returns the aperture for a given lens' attributes and depth of field
 *
 * `dof` may be `Infinity`, in which case the result is derived from `near` alone.
 */
export function calculateAperture({
    focalLength,
    cropFactor,
    distance,
    dof,
    near,
    imperialUnits = false,
}: CalculateApertureOptions): ApertureResult {
    assertFinitePositive('focalLength', focalLength)
    assertFinitePositive('cropFactor', cropFactor)
    assertFinitePositive('distance', distance)
    assertFinitePositive('near', near)
    assertPositiveOrInfinite('dof', dof)
    assertNearLimit(near, distance)
    assertFarLimit(near + dof, distance)

    const mmDist = toMillimeters(distance, imperialUnits)
    const mmDof = toMillimeters(dof, imperialUnits)
    const mmNear = toMillimeters(near, imperialUnits)

    const mmHF = hyperfocalFromDepthOfField({ mmDist, mmNear, mmFar: mmNear + mmDof, focalLength })
    const cropMultiplier = 1 / cropFactor
    const coc = Math.round(0.03 * cropMultiplier * 1000) / 1000
    const aperture = focalLength ** 2 / (coc * mmHF - coc * focalLength)

    const result: ApertureResult = {
        aperture,
        fStop: getApertureName(aperture),
    }

    return result
}
