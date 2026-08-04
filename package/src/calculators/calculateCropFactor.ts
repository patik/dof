import type { CalculateCropFactorOptions, CropFactorResult } from '../types'
import { hyperfocalFromDepthOfField } from '../utilities/hyperfocal'
import { toMillimeters } from '../utilities/units'
import { assertFarLimit, assertFinitePositive, assertNearLimit, assertPositiveOrInfinite } from '../utilities/validate'

/**
 * Returns the crop factor for a given lens' attributes and depth of field
 *
 * `dof` may be `Infinity`, in which case the result is derived from `near` alone.
 */
export function calculateCropFactor({
    near,
    dof,
    focalLength,
    aperture,
    distance,
    imperialUnits = false,
}: CalculateCropFactorOptions): CropFactorResult {
    assertFinitePositive('focalLength', focalLength)
    assertFinitePositive('aperture', aperture)
    assertFinitePositive('distance', distance)
    assertFinitePositive('near', near)
    assertPositiveOrInfinite('dof', dof)
    assertNearLimit(near, distance)
    assertFarLimit(near + dof, distance)

    const mmDist = toMillimeters(distance, imperialUnits)
    const mmDof = toMillimeters(dof, imperialUnits)
    const mmNear = toMillimeters(near, imperialUnits)

    const mmHF = hyperfocalFromDepthOfField({ mmDist, mmNear, mmFar: mmNear + mmDof, focalLength })
    const coc = focalLength ** 2 / (aperture * mmHF - aperture * focalLength)
    const cropMultiplier = (100 * coc) / 3
    const cropFactor = Math.round((1 / cropMultiplier) * 1000) / 1000

    return { cropFactor }
}
