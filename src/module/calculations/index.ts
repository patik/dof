import { decimalAdjust } from './decimalAdjust'
import { feetToFloat } from './feetToFloat'
import { mmToFeet } from './mmToFeet'

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

export default function calculateResult(
    focalLength: number,
    aperture: number,
    cropFactor: number,
    distance: number
): Result {
    const result: Result = {
        dof: 0,
        focalLengthEquiv: 0,
        eighthDof: 0,
        hf: 0,
        near: 0,
        far: 0,
        coc: 0,
    }

    // Convert to millimeters
    distance = distance * 12 * 25.4

    // Get 35mm-equivalent focal length
    result.focalLengthEquiv = decimalAdjust(cropFactor * focalLength)

    // Convert sensor crop factor to a multiplier
    cropFactor = 1 / cropFactor

    result.coc = Math.round(0.03 * cropFactor * 1000) / 1000

    const hf = Math.pow(focalLength, 2) / (aperture * result.coc) + focalLength * 1.0
    const near = (distance * (hf - focalLength)) / (hf + distance + 2 * focalLength)
    let far = (distance * (hf - focalLength)) / (hf - distance)

    let dof: number
    if (far <= 0) {
        far = Infinity
        dof = Infinity
    } else {
        dof = far - near
    }

    // Gather all values
    const dofFeet = mmToFeet(dof)
    result.toString = function () {
        return dofFeet
    }

    // result.dof = dof
    result.dof = feetToFloat(dofFeet)
    result.eighthDof = feetToFloat(mmToFeet(dof / 8))
    result.hf = feetToFloat(mmToFeet(hf))
    result.near = feetToFloat(mmToFeet(near))
    result.far = feetToFloat(mmToFeet(far))

    return result
}
