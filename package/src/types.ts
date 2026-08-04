// This is what the user provides, and nothing is required.
export type Options = {
    focalLength?: number
    aperture?: string | number
    cropFactor?: number
    id?: string
}

// These are used internally by the Lens instance and all properties are defined.
export type Settings = {
    focalLength: number
    aperture: number
    cropFactor: number
    id?: string
}

export type ApertureString = `f/${string}`

export type DefaultOptions = {
    focalLength: Settings['focalLength']
    aperture: ApertureString
    cropFactor: Settings['cropFactor']
    id: Options['id']
}

export type DoFResult = {
    dof: number
    focalLengthEquiv: number
    eighthDof: number
    hf: number
    near: number
    far: number
    coc: number
    toString: () => string
}
