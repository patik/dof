import { calculateResult } from './calculateResult'

const defaults = {
    focalLength: 35,
    aperture: 2,
    cropFactor: 1,
    distance: 20, // Distance to the subject (feet)
}

const apertureRegex = /^f\/(\d+(?:\.\d+)?)$/

/**
 * Lens constructor
 *
 * @param  {Number}            focalLength  Actual local length in millimeters
 * @param  {Number | String}   aperture     Aperture as a float or a string like "f/2.5"
 * @param  {Number}            cropFactor   Sensor crop factor
 * @param  {Number | String}   id           Optional, arbitrary ID for tracking by the consumer
 * @param  {Number | String}   name         Optional, arbitrary name for tracking by the consumer
 */
export class DepthOfFieldLens {
    distance: number
    focalLength: number
    aperture: number
    cropFactor: number
    name = ''
    id = ''

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

    public setDefaults(options: Options) {
        if (typeof options !== 'object' || !options) {
            return this
        }

        if (options.focalLength && !isNaN(options.focalLength)) {
            defaults.focalLength = options.focalLength
        }

        if (options.aperture) {
            if (typeof options.aperture === 'string') {
                defaults.aperture = parseFloat(options.aperture)
            } else if (!isNaN(options.aperture)) {
                defaults.aperture = options.aperture
            }
        }

        if (options.cropFactor && !isNaN(options.cropFactor)) {
            defaults.cropFactor = options.cropFactor
        }

        if (options.distance && !isNaN(options.distance)) {
            defaults.distance = options.distance
        }

        return this
    }

    getResult(distance?: number) {
        if (!distance || isNaN(distance)) {
            distance = defaults.distance
        } else if (typeof distance === 'string') {
            distance = parseFloat(distance)
        }

        return calculateResult(this.focalLength, this.aperture, this.cropFactor, distance)
    }
}
