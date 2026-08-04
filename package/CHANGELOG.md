# dof

## 4.1.0

### Minor Changes

- [#80](https://github.com/patik/dof/pull/80) [`3766e29`](https://github.com/patik/dof/commit/3766e2967f92b18133cb06fbafae19771be63099) Thanks [@patik](https://github.com/patik)! - Add standalone functions for calculating depth of field, aperture, crop factor, and focal length, including typed
  inputs and metric defaults.

  `getApertureName()` now resolves any numeric aperture to the nearest documented f-stop instead of requiring an exact
  match, so calls that previously returned `undefined` for an in-range value now return a string. It still returns
  `undefined` for values that cannot describe an aperture: zero, negative numbers, `NaN`, and `Infinity`.

  The inverse calculators (`calculateAperture()`, `calculateCropFactor()`, `calculateFocalLength()`) throw a
  `RangeError` for input that cannot describe a real depth of field, rather than returning `NaN`.

## 4.0.0

### Major Changes

- Publish `dof` as an ESM-only package with an explicit exports map and zero runtime dependencies. Version 4 requires Node.js 20.19 or newer, emits bundled declarations and source maps, and preserves the existing `Lens`, `createLensMaker`, aperture helpers, and `DepthOfFieldDetails` API.
