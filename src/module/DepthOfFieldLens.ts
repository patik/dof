import calculate from './calculations'

const defaults = Object.freeze({
    focalLength: 35,
    aperture: 2,
    cropFactor: 1,
    distance: 20, // Distance to the subject (feet)
})

const apertureRegex = /^f\/(\d+(?:\.\d+)?)$/

/**
 * Lens constructor
 *
 * @param  focalLength  Actual local length in millimeters (not the 35mm-equivalent)
 * @param  aperture     Aperture as a float or a string like "f/2.5"
 * @param  cropFactor   Sensor crop factor
 * @param  id           Optional, arbitrary ID for tracking by the consumer
 * @param  name         Optional, arbitrary name for tracking by the consumer
 */
export class DepthOfFieldLens {
    readonly distance: number
    readonly focalLength: number
    readonly aperture: number
    readonly cropFactor: number
    readonly name: string = ''
    readonly id: string = ''

    constructor({
        focalLength,
        aperture,
        cropFactor,
        id,
        name,
    }: Options & { id?: string | number; name?: string } = defaults) {
        this.focalLength = focalLength

        if (typeof aperture === 'number') {
            this.aperture = aperture
        } else if (typeof aperture === 'string' && apertureRegex.test(aperture)) {
            const match = apertureRegex.exec(aperture)

            this.aperture = parseFloat(match ? match[1] : '0')
        } else {
            this.aperture = defaults.aperture
        }

        if (typeof cropFactor === 'number') {
            this.cropFactor = cropFactor
        } else {
            this.cropFactor = defaults.cropFactor
        }

        this.distance = defaults.distance

        // Optional properties
        if (typeof id === 'string') {
            this.id = id
        }

        if (typeof name === 'string') {
            this.name = name
        }
    }

    getResult(distance?: number) {
        if (!distance || isNaN(distance)) {
            distance = defaults.distance
        } else if (typeof distance === 'string') {
            distance = parseFloat(distance)
        }

        return calculate(this.focalLength, this.aperture, this.cropFactor, distance)
    }
}
