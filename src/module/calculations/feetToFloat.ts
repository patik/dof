const feetPattern = /^(\d+(?:\.\d+)?)'\s+(\d+(?:\.\d+)?)"$/

/**
 * Converts an imperial distance in standard notation to decimal
 *
 * @example `5' 6"` -> 5.5
 *
 * @param   dist  Distance in standard notation (X' Y")
 * @return        Distance in decimal
 */
export function feetToFloat(dist: string): number {
    if (feetPattern.test(dist)) {
        const parts = feetPattern.exec(dist)

        if (parts) {
            const feet = parseFloat(parts[1])
            const inches = parseFloat(parts[2])

            return feet + inches / 12
        }
    }

    return parseFloat(dist)
}
