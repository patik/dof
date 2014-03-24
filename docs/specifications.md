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
lens.sensor = 1;         // i.e. standard full frame
```

Let's change those to fit the particular lens we have in mind

```js
// Required
lens.focalLength = 35;   // millimeters
lens.aperture = 'f/2.5'; // or just a float: `2.5`
lens.sensor = 1.62;      // Sensor multiplier/crop factor
```

Alternatively, we could have just passed those values in at the start:

```js
var lens = new DoF(35, 'f/2.5', 1.62 /*, '1234', 'My Lens' */ );
```

### Managing multiple lenses

If we're creating multiple lenses, we can assign arbitrary names and IDs to keep track of them:

```js
lens.name = 'My Lens';  // Optional, any data type you'd like
lens.id = 1234;       // Optional, any data type you'd like
```

### Changing default values

You can change any of the defaults. For example, you might want to calculate the depth of field for many lenses with a common sensor crop factor of `1.62`:

```js
DoF.settings.sensor = 1.62;
```

The complete list:

```js
DoF.settings.focalLength = 50;   // Number, in millimeters; this must be the actual focal length, not the 35mm equivalent value
DoF.settings.aperture = 'f/2.5'; // String in the format `"f/2.5"`, or the float value `2.5`
DoF.settings.sensor = 1.62;      // Number; crop factor/multiplier
```

## Calculate the depth of field

To perform a calculation you must specify the distance between the camera and the subject. You can either set a default or pass a particular distance. The value must be a number as measured in feet.

```js
// Specify distance directly
var result1 = lens.result(20);   // 20 feet, the default value
var result2 = lens.result(21.5); // 21 feet 6 inches

// Set a default
DoF.settings.distance = 20.5;
var result = lens.result();
```

The `result` object contains several properties:

```js
result.dof       // Total length of the depth of field; float (e.g. `20.5`)
result.eighthDof // One-eighth of the depth of field; float (e.g. `2.5625`)
result.hf        // Hyperfocal distance; float
result.near      // Distance to the nearest edge of the in-focus field; float
result.far       // Distance to the farthest edge of the in-focus field; float
```

All of those properties have an equivalent property with the value represent as a string, for example `20' 5.2"` for 20 feet, 5.2 inches. The names of the properties are the same, but with `"Feet"` appended (e.g. `dof` becomes `dofFeet`).

```js
result.dofFeet       // Total length of the depth of field in feet (e.g. `"20' 6\""`)
result.eighthDofFeet // One-eighth of the depth of field (e.g. `"2' 6.75\""`)
result.hfFeet        // Hyperfocal distance, in feet, string
result.nearFeet      // Distance to the nearest edge of the in-focus field in feet
result.farFeet       // Distance to the farthest edge of the in-focus field in feet
```

A shorthand way to quickly acquire the depth of field value:

```js
var depth = lens.result().dof;

// Or with a specific distance to the subject:
var depth = lens.result(15).dof;
```

