import { preciseApertureMap } from '../data/preciseApertureMap'
import { objectKeysArray } from './objectKeysArray'

const apertureRegex = /^f\/(\d+(?:\.\d+)?)$/

// It's possible that lenses might excede what we have listed in this map, so let's give the benefit of the doubt and accept those numbers as-is. To do this, we need to know the smallest and largest values in our map.
// We need to ignore test coverage for this line, otherwise it is marked as uncovered; this happens because we're ignoring the thrown exception near the end
/* istanbul ignore next line */
const sortedValues = Object.values(preciseApertureMap).sort((a, b) => (a > b ? 1 : -1))
const smallestDocumentedAperture = sortedValues.slice(undefined, 1)[0]
const largestDocumentedAperture = sortedValues.slice(-1)[0]

/**
 * Takes a human-friendly string and returns a precise numeric value that is equivalent
 * @example 'f/5' => 5.039684
 */
function getPreciseAperture(humanValue: ApertureString): number | undefined {
    if (
        humanValue in preciseApertureMap &&
        Object.prototype.hasOwnProperty.call(preciseApertureMap, humanValue) &&
        preciseApertureMap[humanValue]
    ) {
        return preciseApertureMap[humanValue]
    }

    // Jest needs an explicit return for each code path
    return
}

/**
 * Finds the nearest known aperture to a given number
 * @example nearestValue(1.99) // 2.0
 *
 * @param {number} targetAperture the ideal value for which the nearest or equal should be found
 */
const nearestValue = (targetAperture: number) =>
    sortedValues.reduce((p, n) => (Math.abs(p) > Math.abs(n - targetAperture) ? n - targetAperture : p), Infinity) +
    targetAperture

/**
 * Takes a numeric value and returns a human-friendly string that is equivalent
 * @example 5.039684 => 'f/5'
 */
export function getApertureName(value: number): keyof typeof preciseApertureMap | undefined {
    const asKnownAperture = nearestValue(value)

    return objectKeysArray(preciseApertureMap).find((key) => {
        return preciseApertureMap[key] === asKnownAperture
    })
}

export function isApertureString(value?: string): value is ApertureString {
    return typeof value === 'string' && apertureRegex.test(value)
}

/**
 * Turns user input into a workable aperture value that can be used for calculations
 */
export function toActualAperture({
    input,
    defaultOptionsAperture,
    customSettingsAperture,
}: {
    input?: string | number
    customSettingsAperture?: string | number
    defaultOptionsAperture: ApertureString
}): number {
    // The value is not in our map, but perhaps the user is looking for something larger or smaller than what we have documented
    if (
        typeof input === 'number' &&
        input > 0 &&
        input < Infinity &&
        (input < smallestDocumentedAperture || input > largestDocumentedAperture)
    ) {
        return input
    }

    let apertureString: ApertureString | undefined = undefined

    if (typeof input === 'number') {
        apertureString = `f/${input}`
    } else if (isApertureString(input)) {
        apertureString = input
    } else {
        if (typeof customSettingsAperture === 'number') {
            apertureString = `f/${customSettingsAperture}`
        } else if (typeof customSettingsAperture === 'string' && isApertureString(customSettingsAperture)) {
            apertureString = customSettingsAperture
        }
    }

    let preciseAperture: number | undefined = apertureString ? getPreciseAperture(apertureString) : undefined

    if (!preciseAperture) {
        // The value is not in our map, but perhaps the user is looking for something larger or smaller than what we have documented
        // We need to ignore test coverage for this line, otherwise it is marked as uncovered; this happens because we're ignoring the thrown exception near the end
        /* istanbul ignore next line */
        const inputAsNumber = typeof input === 'number' ? input : Number(input?.replace('f/', ''))

        if (
            inputAsNumber > 0 &&
            Number.isFinite(inputAsNumber) &&
            (inputAsNumber < smallestDocumentedAperture || inputAsNumber > largestDocumentedAperture)
        ) {
            return inputAsNumber
        }
    }

    // Fall back to the default value if we couldn't figure out how to extract one from the input
    if (!preciseAperture) {
        preciseAperture = getPreciseAperture(defaultOptionsAperture)
    }

    // Still did not find something. This is exceedingly unlikely (it's only possible if defaultOptionsAperture is invalid) so let's throw an exception
    // We need to ignore test coverage for this line, otherwise it is marked as uncovered; this happens because we're ignoring the thrown exception near the end
    /* istanbul ignore next line */
    if (!preciseAperture) {
        /* istanbul ignore next */
        throw new Error(`Could not find a valid aperture for this string: ${apertureString}`)
    }

    return preciseAperture
}
