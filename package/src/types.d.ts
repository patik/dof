// This is what the user provides, and nothing is required
type Options = {
    focalLength?: number
    aperture?: string | number
    cropFactor?: number
    id?: string
}

// These are used internally by the Lens instance and all properties are defined
type Settings = {
    focalLength: number
    aperture: number
    cropFactor: number
    id?: string
}

type ApertureString = `f/${string}`

type DefaultOptions = {
    focalLength: Settings['focalLength']
    aperture: ApertureString
    cropFactor: Settings['cropFactor']
    id: Options['id']
}
