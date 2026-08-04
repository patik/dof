# Release Notes

## 4.0.0

- ESM-only package with zero runtime dependencies
- Requires Node.js 20.19 or newer
- Automated releases with npm provenance

Version 3.0.0 is the final CommonJS release. Starting with 4.0.0, `dof` is ESM-only and consumers must load it as an ES module.

Release notes for v4 and later live in [GitHub Releases](https://github.com/patik/dof/releases).

## 3.0.0

- Final CommonJS release; v4 and later are ESM-only

## 2.1.0

- Completely rebuilt GUI web app
- Supports permalinks from the old version of the GUI
- Also uses local storage to persist state
- More type and function exports from the `dof` module

## 2.0.0

- Consumable NPM module for use in any app
- Metric measurements by default, with continued support for imperial units
- Project is modernized for more reliability and easier maintenance

## 1.0.0

- public API for making calculations directly within your own app

_A subsequent release will strip the GUI (moving it to a separate repository) to create a simple utility that can be dropped into any app._

## 0.3.0

- Reduce extra animations when the graph renders
- Better styling of the graph
- Better flow/layout of the graph at different screen sizes
- Updated documentation

## 0.2.0

- Added a live graph

## 0.0.1

- Calculation functionality
- GUI
