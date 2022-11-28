# Depth of Field Calculator

A JavaScript tool for calculating the depth of field of a camera lens

## Overview

The general idea is to create a **lens object**, with specified aperture, focal length, and crop factor values; and then retrieving the object's **depth of field object** for a given **distance** to the subject.

## Create a lens object

```js
const lens = new Lens();
```

That will give us a lens object with default values:

```js
lens.focalLength // 35 (millimeters)
lens.aperture    // 'f/2';
lens.cropFactor  // 1 (i.e. standard full frame)
```

Let's change those to fit the particular lens we have in mind:

```js
const lens = new Lens(35, 'f/2.5', 1.62, 'my-lens-ID');
```

### Managing multiple lenses

If we're creating multiple lenses, we can assign arbitrary IDs to keep track of them:

```js
lens.id = '1234';         // Optional; string
```

### Changing default values

You can change any of the defaults. For example, you might want to calculate the depth of field for many lenses with a common sensor crop factor of `1.62`:

```js
DoF.setDefaults({cropFactor: 1.62});
```

The complete list:

```js
DoF.setDefaults({focalLength: 50});  // Number, in millimeters; this must be the actual focal length, not the 35mm equivalent value
DoF.setDefaults({aperture: 2.5});    // String in the format `"f/2.5"`, or the float value `2.5`
DoF.setDefaults({cropFactor: 1.62}); // Number; sensor's crop factor compared to full frame
DoF.setDefaults({distance: 25});     // Number, in feet
```

## Calculate the depth of field

To perform a calculation you must specify the distance between the camera and the subject. You can either set a default or pass a particular distance. The value must be a number as measured in feet.

```js
// Specify distance directly
const result1 = lens.dof(20);   // 20 feet, the default value
const result2 = lens.dof(21.5); // 21 feet 6 inches

// Set a default
DoF.setDefaults({distance: 20.5});
const result = lens.dof();
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
const str = result.toString();
```

All properties have an equivalent string representation, accessible through the `.toString` property:

```js
result.toString.dof       // Same as `result.toString()`
result.toString.eighthDof
result.toString.hf
result.toString.near
result.toString.far
```

A shorthand way to quickly acquire the depth of field value:

```js
const num = lens.dof().dof;        // float
const str = lens.dof().toString(); // string
```

Or with a specific distance value:

```js
const num = lens.dof(15).dof;        // float
const str = lens.dof(15).toString(); // string
```

