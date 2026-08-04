/**
 * Input guards for the inverse calculators
 *
 * Each of them divides by a value derived from its arguments, so out-of-range input yields `NaN` rather than an
 * obviously wrong number. Throwing keeps a bad value from propagating silently into a caller's UI.
 */

/**
 * Asserts that a value is a real, positive measurement
 */
export function assertFinitePositive(name: string, value: number): void {
    if (!Number.isFinite(value) || value <= 0) {
        throw new RangeError(`\`${name}\` must be a finite number greater than zero, received: ${value}`)
    }
}

/**
 * Asserts that a value is positive, allowing `Infinity` for depths of field that extend to the horizon
 */
export function assertPositiveOrInfinite(name: string, value: number): void {
    if (Number.isNaN(value) || value <= 0) {
        throw new RangeError(`\`${name}\` must be a number greater than zero, or Infinity, received: ${value}`)
    }
}

/**
 * Asserts that the near focus limit falls in front of the subject, which is true of every real depth of field
 */
export function assertNearLimit(near: number, distance: number): void {
    if (near >= distance) {
        throw new RangeError(`\`near\` (${near}) must be closer to the camera than \`distance\` (${distance})`)
    }
}

/**
 * Asserts that the far focus limit falls beyond the subject, which is true of every real depth of field
 */
export function assertFarLimit(far: number, distance: number): void {
    if (far <= distance) {
        throw new RangeError(
            `\`near\` plus \`dof\` (${far}) must be farther from the camera than \`distance\` (${distance})`,
        )
    }
}
