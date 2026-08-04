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
import { Lens, type DepthOfFieldDetails, type DoFResult, type Options } from 'dof'

const options: Options = { focalLength: 50, aperture: 'f/2' }
const lens = new Lens(options)
const result: DoFResult = lens.dof(4)
const details: DepthOfFieldDetails = result
```

`DepthOfFieldDetails` remains an alias of `DoFResult` for compatibility.

## License

BSD-3-Clause
