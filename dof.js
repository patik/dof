(function (global, name, definition) {
    // Require
    if (typeof define === 'function' && define.amd) {
        define([], definition);
    }
    // CommonJS
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = name;
    }
    // Fall back to a global variable
    else {
        global[name] = definition();
    }
}(
    this,
    'DoF',
    function () {
        var defaults = {
                focalLength: 35, // Number, in millimeters. This must be the actual focal length, not the 35mm equivalent value
                aperture: 2,     // String in the format `"f/2.5"`, or the float value `2.5`
                cropFactor: 1,   // Sensor crop factor (compared to full frame; 2 = a half-size sensor)
                distance: 20     // Distance to the subject (feet)
            };

        var apertureRegex = /^f\/(\d+(?:\.\d+)?)$/;

        var _feetToFloat = function _feetToFloat(dist) {
                var parts;
                var feet;
                var inches;

                if (/^(\d+(?:\.\d+)?)\'\s+(\d+(?:\.\d+)?)\"$/.test(dist)) {
                    parts = /^(\d+(?:\.\d+)?)\'\s+(\d+(?:\.\d+)?)\"$/.exec(dist);
                    feet = parseFloat(parts[1]);
                    inches = parseFloat(parts[2]);

                    return parseFloat(feet + (inches / 12));
                }

                return dist;
            };

        var _calculate = function _calculate(focalLength, aperture, cropFactor, distance) {
            var result = {};
            var hf;
            var near;
            var far;
            var dof;
            var dofFeet;

            // Convert to millimeters
            distance = distance * 12 * 25.4;

            // Get 35mm-equivalent focal length
            result.focalLengthEquiv = _decimalAdjust(cropFactor * focalLength);

            // Convert sensor crop factor to a multiplier
            cropFactor = 1 / cropFactor;

            result.coc = Math.round(0.03 * cropFactor * 1000) / 1000;
            hf = Math.pow(focalLength, 2) / (aperture * result.coc) + (focalLength * 1.0);

            near = (distance * (hf - focalLength)) / (hf + distance + (2 * focalLength));
            far = (distance * (hf - focalLength)) / (hf - distance);

            if (far <= 0) {
                far = Infinity;
                dof = Infinity;
            }
            else {
                dof = far - near;
            }

            // Gather all values
            dofFeet = _mmToFeet(dof);
            result.toString = function () {
                return dofFeet;
            };

            result.toString.dof = dofFeet;
            result.dof = _feetToFloat(result.toString.dof);
            result.toString.eighthDof = _mmToFeet(dof / 8);
            result.eighthDof = _feetToFloat(result.toString.eighthDof);
            result.toString.hf = _mmToFeet(hf);
            result.hf = _feetToFloat(result.toString.hf);
            result.toString.near = _mmToFeet(near);
            result.near = _feetToFloat(result.toString.near);
            result.toString.far = _mmToFeet(far);
            result.far = _feetToFloat(result.toString.far);

            return result;
        };

        /**
         * Convert millimeters to decimal feet and inches
         *
         * @param  dist     Length in millimeters
         * @return {String} Length (feet/inches), or infinity
         */
        var _mmToFeet = function _mmToFeet(dist) {
            // Convert millimeters to inches
            dist = dist / 25.4;

            if (dist === Infinity) {
                return Infinity;
            }
            else {
                return Math.floor(dist / 12) + "' " + (dist % 12).toFixed(1) + '"';
            }
        };

        /**
         * Decimal adjustment of a number.
         * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Example:_Decimal_rounding
         *
         * @param   {Number}    value   The number
         * @returns {Number}            The adjusted value
         */
        var _decimalAdjust = function _decimalAdjust(value) {
            var exp = -1; // The exponent (the 10 logarithm of the adjustment base)

            value = +value;

            // If the value is not a number or the exp is not an integer...
            if (isNaN(value)) {
                return NaN;
            }

            // Shift
            value = value.toString().split('e');
            value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

            // Shift back
            value = value.toString().split('e');

            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        };

        /**
         * Lens constructor
         *
         * @param  {Number}  focalLength  Actual local length in millimeters
         * @param  {Mixed}   aperture     Aperture as a float or a string like "f/2.5"
         * @param  {Number}  cropFactor   Sensor crop factor
         * @param  {Mixed}   id           Optional, arbitrary ID for tracking by the consumer
         * @param  {Mixed}   name         Optional, arbitrary name for tracking by the consumer
         */
        var DoF = function (focalLength, aperture, cropFactor, id, name) {
            if (typeof focalLength === 'string' && focalLength.length) {
                focalLength = parseFloat(focalLength);
            }

            if (typeof focalLength === 'number') {
                this.focalLength = focalLength;
            }
            else {
                this.focalLength = defaults.focalLength;
            }

            if (typeof aperture === 'number') {
                this.aperture = aperture;
            }
            else if (typeof aperture === 'string' && apertureRegex.test(aperture)) {
                this.aperture = parseFloat(apertureRegex.exec(aperture)[1]);
            }
            else {
                this.aperture = defaults.aperture;
            }

            if (typeof cropFactor === 'number') {
                this.cropFactor = cropFactor;
            }
            else {
                this.cropFactor = defaults.cropFactor;
            }

            // Optional properties
            if (typeof id !== 'undefined') {
                this.id = id;
            }

            if (typeof name !== 'undefined') {
                this.name = name;
            }
        };

        DoF.setDefaults = function _setDefaults(options) {
            if (typeof options !== 'object' || !options) {
                return;
            }

            if (options.focalLength && !isNaN(options.focalLength)) {
                defaults.focalLength = parseFloat(options.focalLength);
            }

            if (options.aperture && !isNaN(options.aperture)) {
                if (typeof options.aperture === 'string') {
                    defaults.aperture = parseFloat(options.aperture);
                }
                else {
                    defaults.aperture = options.aperture;
                }
            }

            if (options.cropFactor && !isNaN(options.cropFactor)) {
                defaults.cropFactor = parseFloat(options.cropFactor);
            }

            if (options.distance && !isNaN(options.distance)) {
                defaults.distance = parseFloat(options.distance);
            }
        };

        DoF.prototype.getResult = function _getResult(distance) {
            var _this = this;

            if (isNaN(distance)) {
                distance = defaults.distance;
            }
            else if (typeof distance === 'string') {
                distance = parseFloat(distance);
            }

            return _calculate(_this.focalLength, _this.aperture, _this.cropFactor, distance);
        };

        return DoF;
    }
));
