/**
 * Converts an imperial distance in standard notation to decimal
 *
 * @example `5' 6"` -> 5.5
 *
 * @param {String} dist  Distance in standard notation (X' Y")
 * @return {String}      Distance in decimal
 */
function _feetToFloat(dist: string): number {
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

/**
 * Convert millimeters to feet
 *
 * @param  dist     Length in millimeters
 * @return {String} Length (feet/inches) as a decimal, or infinity
 */
function _mmToFeet(dist: number): string {
    // Convert millimeters to inches
    dist = dist / 25.4

    if (dist === Infinity) {
        return 'Infinity'
    } else {
        return Math.floor(dist / 12) + "' " + (dist % 12).toFixed(1) + '"'
    }
}

/**
 * Decimal adjustment of a number.
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Example:_Decimal_rounding
 *
 * @param   {Number}    value   The number
 * @returns {Number}            The adjusted value
 */
function _decimalAdjust(value: number): number {
    const exp = -1 // The exponent (the 10 logarithm of the adjustment base)

    value = +value

    // If the value is not a number or the exp is not an integer...
    if (isNaN(value)) {
        return NaN
    }

    // Shift
    const parts = value.toString().split('e')

    const shifted = Math.round(+(parts[0] + 'e' + (parts[1] ? +parts[1] - exp : -exp)))

    // Shift back
    const unshifted = shifted.toString().split('e')

    return +(unshifted[0] + 'e' + (unshifted[1] ? +unshifted[1] + exp : exp))
}

export function calculateResult(focalLength: number, aperture: number, cropFactor: number, distance: number): Result {
    const result: Result = {
        dof: 0,
        focalLengthEquiv: 0,
        eighthDof: 0,
        hf: 0,
        near: 0,
        far: 0,
        coc: 0,
    }

    // Convert to millimeters
    distance = distance * 12 * 25.4

    // Get 35mm-equivalent focal length
    result.focalLengthEquiv = _decimalAdjust(cropFactor * focalLength)

    // Convert sensor crop factor to a multiplier
    cropFactor = 1 / cropFactor

    result.coc = Math.round(0.03 * cropFactor * 1000) / 1000
    const hf = Math.pow(focalLength, 2) / (aperture * result.coc) + focalLength * 1.0

    const near = (distance * (hf - focalLength)) / (hf + distance + 2 * focalLength)
    let far = (distance * (hf - focalLength)) / (hf - distance)

    let dof: number
    if (far <= 0) {
        far = Infinity
        dof = Infinity
    } else {
        dof = far - near
    }

    // Gather all values
    const dofFeet = _mmToFeet(dof)
    result.toString = function () {
        return dofFeet
    }

    // result.dof = dof
    // result.toString.dof = dofFeet
    result.dof = _feetToFloat(dofFeet)
    // result.toString.eighthDof = _mmToFeet(dof / 8)
    result.eighthDof = _feetToFloat(_mmToFeet(dof / 8))
    // result.toString.hf = _mmToFeet(hf)
    result.hf = _feetToFloat(_mmToFeet(hf))
    // result.toString.near = _mmToFeet(near)
    result.near = _feetToFloat(_mmToFeet(near))
    // result.toString.far = _mmToFeet(far)
    result.far = _feetToFloat(_mmToFeet(far))

    return result
}
