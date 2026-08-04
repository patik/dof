import { builtInDefaults } from '../Lens'
import { toActualAperture } from './aperture'

/**
 * Guarantees that all settings have a defined value
 */
export function combineSettings(options: Options, customDefaults: Options = builtInDefaults): Settings {
    const aperture = toActualAperture({
        input: options.aperture,
        defaultOptionsAperture: builtInDefaults.aperture,
        customSettingsAperture: customDefaults.aperture,
    })

    return {
        focalLength:
            options.focalLength !== undefined
                ? options.focalLength
                : (customDefaults.focalLength ?? builtInDefaults.focalLength),
        aperture,
        cropFactor:
            options.cropFactor !== undefined
                ? options.cropFactor
                : (customDefaults.cropFactor ?? builtInDefaults.cropFactor),
        id: options.id !== undefined ? options.id : customDefaults.id,
    }
}
