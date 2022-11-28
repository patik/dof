import { getActualAperture } from './utilities/aperture'
import { calculateDepthOfField } from './utilities/calculateDepthOfField'

type Options = {
    focalLength?: number
    aperture?: string | number
    cropFactor?: number
}

const defaults = Object.freeze({
    focalLength: 35,
    aperture: 2,
    cropFactor: 1,
    distanceMetric: 5, // Distance to the subject, in meters
    distanceImperial: 15, // Distance to the subject, in feet
    id: undefined,
})

const apertureRegex = /^f\/(\d+(?:\.\d+)?)$/

/**
 * Depth of Field Lens object which can be used to calculate the depth of field at various distances
 *
 * @param  focalLength  Actual local length in millimeters (not the 35mm-equivalent)
 * @param  aperture     Aperture as a float or a string like "f/2.5"
 * @param  cropFactor   Sensor crop factor
 * @param  id           Optional, arbitrary ID for tracking by the consumer
 */
export class Lens {
    readonly focalLength: number
    readonly aperture: number
    readonly cropFactor: number
    readonly id: string | undefined

    constructor({ focalLength, aperture, cropFactor, id }: Options & { id?: string } = defaults) {
        this.focalLength = typeof focalLength === 'number' ? focalLength : defaults.focalLength
        this.cropFactor = typeof cropFactor === 'number' ? cropFactor : defaults.cropFactor
        this.id = typeof id === 'number' || typeof id === 'string' ? id : defaults.id

        if (typeof aperture === 'number') {
            aperture = `f/${aperture}`
        } else if (typeof aperture !== 'string' || !apertureRegex.test(aperture)) {
            aperture = `f/${defaults.aperture}`
        }

        this.aperture = getActualAperture(aperture) ?? defaults.aperture
    }

    /**
     * Determines the depth of field for the lens at the given distance
     *
     * @param distance Distance to the subject, in meters
     * @param imperialUnits Whether to use imperial units (feet) instead of metric
     */
    dof(distance?: number, imperialUnits = false) {
        if (distance === undefined || isNaN(distance)) {
            distance = imperialUnits ? defaults.distanceImperial : defaults.distanceMetric
        } else if (typeof distance === 'string') {
            distance = parseFloat(distance)
        }

        return calculateDepthOfField(this.focalLength, this.aperture, this.cropFactor, distance, imperialUnits)
    }
}
