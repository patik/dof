# [Depth of Field Calculator](https://patik.com/dof/)

A JavaScript tool for calculating the depth of field of camera lenses

## Node module

The general idea is to create a **lens object**, with specified aperture, focal length, and crop factor values; and then retrieving the object's **depth of field object** for a given **distance** to the subject.

### Install

```sh
yarn add dof

# or

npm install dof
```

### Create a lens object

```js
import { Lens } from 'dof'

const lens = new Lens()
```

That will give us a lens object with default values:

```js
lens.focalLength // 35 (millimeters)
lens.aperture    // 'f/2'
lens.cropFactor  // 1 (i.e. standard full frame)
```

Let's change those to fit the particular lens we have in mind:

```js
const lens = new Lens(35, 'f/2.5', 1.62);
```

#### Reusing default values

You can create function which generates lenses in bulk using your own set of defauls. For example, you might want to calculate the depth of field for many lenses with a common sensor crop factor of `1.62`:

```js
const lensMaker = createLensMaker({ cropFactor: 1.62 })

const lens1 = lensMaker()
const lens2 = lensMaker({ aperture: 'f/3.6' })
```

The complete list of configurable defaults:

```js
focalLength: 35  // Number, in millimeters; this must be the actual focal length, not the 35mm equivalent value
aperture: 'f/2'  // String in the format `"f/2.5"`
cropFactor: 1    // Floating point number; sensor's crop factor compared to full frame
```

#### Managing multiple lenses

Lenses can be assigned arbitrary IDs to make it easier to keep track of them:

```js
const lens = new Lens(35, 'f/2.5', 1.62, 'my-lens-ID');// Optional; string

console.log(lens.id) // 'my-lens-ID'
```

### Calculate the depth of field

To perform a calculation you must specify the distance between the camera and the subject. You can either set a default or pass a particular distance. The value must be a number as measured in meters (default) or feet.

```js
// Specify distance directly
const result1 = lens.dof(5)    // 5 mmeters, the default value
const result2 = lens.dof(22.6) // 22 meters and 60 centimeters

// Imperial units
const result2 = lens.dof(15, true) // 15 feet, the default value
```

The `result` object contains several properties:

```js
result.dof       // Total length of the depth of field; float (e.g. `20.5`), meters or feet
result.eighthDof // One-eighth of the depth of field; float (e.g. `2.5625`), meters or feet
result.hf        // Hyperfocal distance; float, meters or feet
result.near      // Distance to the nearest edge of the in-focus field; float, meters or feet
result.far       // Distance to the farthest edge of the in-focus field; float, meters or feet
result.coc       // Circle of confusion; float, always millimeters
```

Note that the value of those properties may be `Infinity`. This is especially common with small sensor sizes (large crop factors), short focal lengths, and/or small apertures (large `f/` values).

You can use the `.toString()` method to get the depth of field value as a string. For example, `20' 5.2"` is 20 feet, 5.2 inches.

```js
const str = result.toString()
```

All properties have an equivalent string representation, accessible through the `.toString` property:

```js
result.toString.dof        // Same as `result.toString()`
result.toString.eighthDof
result.toString.hf
result.toString.near
result.toString.far
```

A shorthand way to quickly acquire the depth of field value:

```js
const num = lens.dof().dof        // float
const str = lens.dof().toString() // string
```

Or with a specific distance value:

```js
const num = lens.dof(15).dof        // float
const str = lens.dof(15).toString() // string
```

### TypeScript support

`Lens()` instances use the `DepthOfFieldLens` type which can be imported from the module.

## GUI Web App

Calculate the depth of field for multiple lenses and compare them side-by-side

**[Try it at patik.com/dof](https://patik.com/dof/)**

[Documentation](https://patik.com/dof/about/)

[![Screenshot of two lens configurations](./app/public/images/with-graph.png "Lens comparison")](https://patik.com/dof/#5m;Panasonic%2025mm,25,f-1.4,mft;Olympus%2025mm,25,f-1.8,mft)
