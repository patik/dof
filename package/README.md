# dof

The zero-dependency calculation engine behind the [Depth of Field Calculator](https://patik.com/dof/).

`dof` 4 is ESM-only and requires Node.js 20.19 or newer.

## Install

```sh
bun add dof
# or: yarn add dof
# or: pnpm add dof
# or: npm install dof
```

## Create a lens

```js
import { Lens } from 'dof'

const lens = new Lens({
    focalLength: 35,
    aperture: 'f/2.5',
    cropFactor: 1.62,
    id: 'portrait-lens',
})
```

All constructor options are optional. The defaults are a 35 mm lens at f/2 on a full-frame sensor:

```js
const defaultLens = new Lens()

defaultLens.focalLength // 35
defaultLens.aperture // 2 (the precise numeric aperture)
defaultLens.cropFactor // 1
defaultLens.id // undefined
```

`focalLength` is the actual focal length in millimeters, not its 35 mm equivalent. `cropFactor` is relative to full frame.

## Reuse custom defaults

`createLensMaker` creates a lens factory with shared defaults:

```js
import { createLensMaker } from 'dof'

const makeLens = createLensMaker({ cropFactor: 1.62 })
const wide = makeLens({ focalLength: 24, aperture: 'f/2.8' })
const portrait = makeLens({ focalLength: 85, aperture: 'f/1.8' })
```

Options passed to the factory call override its custom defaults.

## Calculate depth of field

Pass the subject distance to `lens.dof()`. Distances and results use meters by default:

```js
const result = lens.dof(5)

result.dof // Total depth of field
result.eighthDof // One-eighth of the depth of field
result.hf // Hyperfocal distance
result.near // Near edge of acceptable focus
result.far // Far edge of acceptable focus
result.coc // Circle of confusion, always in millimeters
result.focalLengthEquiv // 35 mm-equivalent focal length
result.toString() // The depth-of-field value as a string
```

Pass `true` as the second argument to use feet:

```js
const imperialResult = lens.dof(15, true)
```

Numeric result properties can be `Infinity` when the far focus limit extends to infinity.

If distance is omitted, `dof()` uses 5 meters or, in imperial mode, 15 feet.

## Use the standalone calculators

The package also exports individual functions for calculating depth of field, aperture, crop factor, or focal length
without creating a `Lens` instance:

```js
import {
    calculateAperture,
    calculateCropFactor,
    calculateDepthOfField,
    calculateFocalLength,
} from 'dof'

const depthOfField = calculateDepthOfField({
    focalLength: 35,
    aperture: 2,
    cropFactor: 1,
    distance: 5,
})

const aperture = calculateAperture({
    focalLength: 35,
    cropFactor: 1,
    distance: 5,
    dof: depthOfField.dof,
    near: depthOfField.near,
}) // { aperture: 2, fStop: 'f/2' }

const cropFactor = calculateCropFactor({
    focalLength: 35,
    aperture: 2,
    distance: 5,
    dof: depthOfField.dof,
    near: depthOfField.near,
}) // { cropFactor: 1 }

const focalLength = calculateFocalLength({
    aperture: 2,
    cropFactor: 1,
    distance: 5,
    near: depthOfField.near,
}) // { focalLength: 35, focalLengthEquiv: 35 }
```

`focalLength` is always in millimeters. `distance`, `near`, and `dof` use meters by default; pass
`imperialUnits: true` to use feet. Aperture values are precise numeric f-numbers, and crop factor is relative to full
frame.

`calculateAperture()` and `calculateCropFactor()` accept an infinite `dof`, in which case they derive the result from
`near` alone. `calculateFocalLength()` only reads `near`, so it is unaffected either way.

### Accuracy

The inverse calculators recover their answer from a depth-of-field range, which is a lossy starting point:

- The circle of confusion is quantized to three decimal places, and a crop factor recovered through it can differ from
  the original by a few percent. The error grows with the crop factor — round-tripping a full-frame sensor is exact,
  while a phone sensor near 7.2× lands around 7.5×.
- `calculateFocalLength()` rounds to a whole millimeter, so a 24.5mm lens comes back as `25`.
- `calculateAperture()` returns an unrounded f-number that may carry floating-point dust, such as `2.000000000000001`.
  Use the accompanying `fStop` when you want a value to display.

### Errors

The inverse calculators throw a `RangeError` when the input cannot describe a real depth of field — a non-positive or
non-finite measurement, a `near` limit that is not closer than `distance`, or a far limit (`near + dof`) that is not
beyond it. `calculateDepthOfField()` does not validate its input and is unchanged in this respect.

## Aperture helpers

```js
import { apertureMap, getApertureName, isApertureString } from 'dof'

apertureMap['f/2.8']
getApertureName(2.828427) // 'f/2.8'
isApertureString('f/2.8') // true
```

## TypeScript

The package includes bundled declarations and exports its public input and result types:

```ts
import {
    Lens,
    type CalculateDepthOfFieldOptions,
    type DepthOfFieldDetails,
    type DoFResult,
    type Options,
} from 'dof'

const options: Options = { focalLength: 50, aperture: 'f/2' }
const lens = new Lens(options)
const result: DoFResult = lens.dof(4)
const details: DepthOfFieldDetails = result

const calculatorOptions: CalculateDepthOfFieldOptions = {
    focalLength: 50,
    aperture: 2,
    cropFactor: 1,
    distance: 4,
}
```

`DepthOfFieldDetails` remains an alias of `DoFResult` for compatibility.

## License

BSD-3-Clause
