type Result = {
    dof: number
    focalLengthEquiv: number
    eighthDof: number
    hf: number
    near: number
    far: number
    coc: number
    toString: () => string
}

type Lens = {
    focalLength: number
    aperture: number
    cropFactor: number
    name: string
    id: string
}

type Options = {
    focalLength: number
    aperture: number
    cropFactor: number
    distance: number
}

function DoF() {
    const defaults = {
        focalLength: 35, // Number, in millimeters. This must be the actual focal length, not the 35mm equivalent value
        aperture: 2, // String in the format `"f/2.5"`, or the float value `2.5`
        cropFactor: 1, // Sensor crop factor (compared to full frame; 2 = a half-size sensor)
        distance: 20, // Distance to the subject (feet)
    }

    const apertureRegex = /^f\/(\d+(?:\.\d+)?)$/

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

    function _calculate(focalLength: number, aperture: number, cropFactor: number, distance: number): Result {
        const result: Result = {
            dof: 0,
            focalLengthEquiv: 0,
            eighthDof: 0,
            hf: 0,
            near: 0,
            far: 0,
            coc: 0,
        }
        let far: number
        let dof: number

        // Convert to millimeters
        distance = distance * 12 * 25.4

        // Get 35mm-equivalent focal length
        result.focalLengthEquiv = _decimalAdjust(cropFactor * focalLength)

        // Convert sensor crop factor to a multiplier
        cropFactor = 1 / cropFactor

        result.coc = Math.round(0.03 * cropFactor * 1000) / 1000
        const hf = Math.pow(focalLength, 2) / (aperture * result.coc) + focalLength * 1.0

        const near = (distance * (hf - focalLength)) / (hf + distance + 2 * focalLength)
        far = (distance * (hf - focalLength)) / (hf - distance)

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

    /**
     * Convert millimeters to decimal feet and inches
     *
     * @param  dist     Length in millimeters
     * @return {String} Length (feet/inches), or infinity
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

    /**
     * Lens constructor
     *
     * @param  {Number}  focalLength  Actual local length in millimeters
     * @param  {Mixed}   aperture     Aperture as a float or a string like "f/2.5"
     * @param  {Number}  cropFactor   Sensor crop factor
     * @param  {Mixed}   id           Optional, arbitrary ID for tracking by the consumer
     * @param  {Mixed}   name         Optional, arbitrary name for tracking by the consumer
     */
    const DoF = function (
        focalLength: number,
        aperture: string | number,
        cropFactor: number,
        id: string | number,
        name: string
    ) {
        const lens: Lens = {
            focalLength: 0,
            aperture: 0,
            cropFactor: 0,
            id: '',
            name: '',
        }

        lens.focalLength = focalLength

        if (typeof aperture === 'number') {
            lens.aperture = aperture
        } else if (typeof aperture === 'string' && apertureRegex.test(aperture)) {
            const match = apertureRegex.exec(aperture)

            lens.aperture = parseFloat(match ? match[1] : '0')
        } else {
            lens.aperture = defaults.aperture
        }

        if (typeof cropFactor === 'number') {
            lens.cropFactor = cropFactor
        } else {
            lens.cropFactor = defaults.cropFactor
        }

        // Optional properties
        if (typeof id === 'string') {
            lens.id = id
        }

        if (typeof name === 'string') {
            lens.name = name
        }

        this = lens
    }

    DoF.setDefaults = function _setDefaults(options: Options) {
        if (typeof options !== 'object' || !options) {
            return
        }

        if (options.focalLength && !isNaN(options.focalLength)) {
            defaults.focalLength = options.focalLength
        }

        if (options.aperture && !isNaN(options.aperture)) {
            if (typeof options.aperture === 'string') {
                defaults.aperture = parseFloat(options.aperture)
            } else {
                defaults.aperture = options.aperture
            }
        }

        if (options.cropFactor && !isNaN(options.cropFactor)) {
            defaults.cropFactor = options.cropFactor
        }

        if (options.distance && !isNaN(options.distance)) {
            defaults.distance = options.distance
        }
    }

    DoF.prototype.getResult = function _getResult(distance: number) {
        // const this = this

        if (isNaN(distance)) {
            distance = defaults.distance
        } else if (typeof distance === 'string') {
            distance = parseFloat(distance)
        }

        return _calculate(this.focalLength, this.aperture, this.cropFactor, distance)
    }

    return DoF
}

export default DoF
