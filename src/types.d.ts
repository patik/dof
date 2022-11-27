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

type Options = {
    focalLength: number
    aperture: string | number
    cropFactor: number
    distance: number
}
