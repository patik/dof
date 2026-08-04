---
'dof': minor
---

Add standalone functions for calculating depth of field, aperture, crop factor, and focal length, including typed
inputs and metric defaults.

`getApertureName()` now resolves any numeric aperture to the nearest documented f-stop instead of requiring an exact
match, so calls that previously returned `undefined` for an in-range value now return a string. It still returns
`undefined` for values that cannot describe an aperture: zero, negative numbers, `NaN`, and `Infinity`.

The inverse calculators (`calculateAperture()`, `calculateCropFactor()`, `calculateFocalLength()`) throw a
`RangeError` for input that cannot describe a real depth of field, rather than returning `NaN`.
