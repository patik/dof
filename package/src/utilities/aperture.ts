import { preciseApertureMap } from '../data/preciseApertureMap'
import type { ApertureString } from '../types'
import { objectKeysArray } from './objectKeysArray'

const apertureRegex = /^f\/(\d+(?:\.\d+)?)$/

// It's possible that lenses might exceed what we have listed in this map, so let's give the benefit of the doubt and accept those numbers as-is. To do this, we need to know the smallest and largest values in our map.
// We need to ignore test coverage for this line, otherwise it is marked as uncovered; this happens because we're ignoring the thrown exception near the end
/* istanbul ignore next line */
const sortedValues = Object.values(preciseApertureMap).sort((a, b) => (a > b ? 1 : -1))

function getApertureBounds(values: number[]): [number, number] {
    const smallest = values[0]
    const largest = values[values.length - 1]

    if (smallest === undefined || largest === undefined) {
        throw new Error('The aperture map must contain at least one value')
    }

    return [smallest, largest]
}

const [smallestDocumentedAperture, largestDocumentedAperture] = getApertureBounds(sortedValues)

type DocumentedAperture = keyof typeof preciseApertureMap

/**
 * Narrows an arbitrary f-stop string to one the map actually documents
 */
function isDocumentedAperture(value: ApertureString): value is DocumentedAperture {
    return Object.hasOwn(preciseApertureMap, value)
}

/**
 * Takes a human-friendly string and returns a precise numeric value that is equivalent
 * @example 'f/5' => 5.039684
 */
function getPreciseAperture(humanValue: ApertureString): number | undefined {
    return isDocumentedAperture(humanValue) ? preciseApertureMap[humanValue] : undefined
}

function getNearestApertureValue(targetAperture: number): number {
    return sortedValues.reduce((nearest, current) =>
        Math.abs(current - targetAperture) < Math.abs(nearest - targetAperture) ? current : nearest,
    )
}

/**
 * Takes a numeric value and returns the human-friendly string for the closest documented f-stop
 *
 * Returns `undefined` for values that cannot describe an aperture, since every finite comparison against `NaN` or
 * `Infinity` is false and the nearest-match search would otherwise report the smallest f-stop in the map.
 *
 * @example 5.039684 => 'f/5'
 * @example 5.01 => 'f/5'
 */
export function getApertureName(value: number): keyof typeof preciseApertureMap | undefined {
    if (!Number.isFinite(value) || value <= 0) {
        return
    }

    const nearestValue = getNearestApertureValue(value)

    return objectKeysArray(preciseApertureMap).find((key) => {
        return preciseApertureMap[key] === nearestValue
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

    let apertureString: ApertureString | undefined

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
