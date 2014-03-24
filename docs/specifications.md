# Depth of Field Calculator

A simple JavaScript tool for calculating the depth of field of a camera lens


## Overview

The general idea is to create a **lens object**, with specified aperture, focal length, and crop factor values; and then retrieving the object's **depth of field object** for a given **distance** to the subject.

## Create a lens object

```js
var lens = new DoF();
```

That will give us a lens object with default values:

```js
lens.focalLength = 35;   // millimeters
lens.aperture = 'f/2';
lens.cropFactor = 1;     // i.e. standard full frame
```

Let's change those to fit the particular lens we have in mind

```js
// Required
lens.focalLength = 35;   // millimeters
lens.aperture = 'f/2.5'; // or just a float: `2.5`
lens.cropFactor = 1.62;  // sensor crop factor
```

Alternatively, we could have just passed those values in at the start:

```js
var lens = new DoF(35, 'f/2.5', 1.62 /*, '1234', 'My Lens' */ );
```

### Managing multiple lenses

If we're creating multiple lenses, we can assign arbitrary names and IDs to keep track of them:

```js
lens.name = 'My Lens';  // Optional; any data type you'd like
lens.id = 1234;         // Optional; any data type you'd like
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
var result1 = lens.result(20);   // 20 feet, the default value
var result2 = lens.result(21.5); // 21 feet 6 inches

// Set a default
DoF.setDefaults({distance: 20.5});
var result = lens.result();
```

The `result` object contains several properties:

```js
result.dof       // Total length of the depth of field; float (e.g. `20.5`)
result.eighthDof // One-eighth of the depth of field; float (e.g. `2.5625`)
result.hf        // Hyperfocal distance; float
result.near      // Distance to the nearest edge of the in-focus field; float
result.far       // Distance to the farthest edge of the in-focus field; float
result.coc       // Circle of confusion; float, millimeters
```

Note that the value of those properties may be `Infinity`. This is especially common with small sensor sizes (large crop factors), short focal lengths, and/or small apertures (large `f/` values).

You can use the `.toString()` method to get the depth of field value as a string. For example, `20' 5.2"` is 20 feet, 5.2 inches.

```js
var str = result.toString();
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
var num = lens.result().dof;        // float
var str = lens.result().toString(); // string
```

Or with a specific distance value:

```js
var num = lens.result(15).dof;        // float
var str = lens.result(15).toString(); // string
```

