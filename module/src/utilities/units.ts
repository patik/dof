/**
 * Returns a number that a value can be multiplied by to assure the value is metric
 *
 * @param imperialUnits true if value is in feet instead of meters
 */
function getUnitMultiplier(imperialUnits = false): number {
    // e.g. 1 foot is 30.48% of 1 meter
    return imperialUnits ? 0.3048 : 1
}

/**
 * Convert a value from meters or feet, to millimeters
 *
 * @param value value in meters or feet
 * @param imperialUnits true if value is in feet instead of meters
 */
export function toMillimeters(value: number, imperialUnits = false): number {
    return value * 1000 * getUnitMultiplier(imperialUnits)
}

/**
 * Convert a value from millimeters to meters or feet
 *
 * @param value value in millimeters
 * @param imperialUnits true if value should be in feet instead of meters
 */
export function fromMillimeters(value: number, imperialUnits = false): number {
    return value / 1000.0 / getUnitMultiplier(imperialUnits)
}
