import { toActualAperture } from './aperture'
import { defaultOptions } from '../Lens'

/**
 * Guarantees that all settings have a defined value
 */
export function combineSettings(
    { focalLength, aperture, cropFactor, id }: Options,
    defaultSettings: Options = defaultOptions
): Settings {
    let definedFocalLength: Settings['focalLength']

    if (typeof focalLength === 'number') {
        definedFocalLength = focalLength
    } else if (typeof defaultSettings.focalLength === 'number') {
        definedFocalLength = defaultSettings.focalLength
    } else {
        definedFocalLength = defaultOptions.focalLength
    }

    let definedCropFactor: Settings['cropFactor']

    if (typeof cropFactor === 'number') {
        definedCropFactor = cropFactor
    } else if (typeof defaultSettings.cropFactor === 'number') {
        definedCropFactor = defaultSettings.cropFactor
    } else {
        definedCropFactor = defaultOptions.cropFactor
    }

    aperture = toActualAperture({
        input: aperture,
        defaultOptionsAperture: defaultOptions.aperture,
        customSettingsAperture: defaultSettings.aperture,
    })

    const result: Settings = {
        focalLength: definedFocalLength,
        cropFactor: definedCropFactor,
        aperture,
        id: id ?? defaultSettings.id ?? '',
    }

    return result
}
