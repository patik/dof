/**
 * Converts an imperial distance in standard notation to decimal
 *
 * @example `5' 6"` -> 5.5
 *
 * @param {String} dist  Distance in standard notation (X' Y")
 * @return {String}      Distance in decimal
 */
export function feetToFloat(dist: string): number {
    let parts: RegExpExecArray | null
    let feet: number
    let inches: number

    if (/^(\d+(?:\.\d+)?)'\s+(\d+(?:\.\d+)?)"$/.test(dist)) {
        parts = /^(\d+(?:\.\d+)?)'\s+(\d+(?:\.\d+)?)"$/.exec(dist)

        if (parts) {
            feet = parseFloat(parts[1])
            inches = parseFloat(parts[2])

            return feet + inches / 12
        }
    }

    return parseFloat(dist)
}
