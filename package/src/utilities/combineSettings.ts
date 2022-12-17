import { toActualAperture } from './aperture'
import { builtInDefaults } from '../Lens'
import { defaults } from 'lodash-es'

/**
 * Guarantees that all settings have a defined value
 */
export function combineSettings(options: Options, customDefaults: Options = builtInDefaults): Settings {
    const combined = defaults({}, options, customDefaults, builtInDefaults)
    const aperture = toActualAperture({
        input: options.aperture,
        defaultOptionsAperture: builtInDefaults.aperture,
        customSettingsAperture: customDefaults.aperture,
    })

    return {
        ...combined,
        aperture,
    }
}
