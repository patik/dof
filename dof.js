(function (name, definition) {
    if (typeof define === "function" && define.amd) {
        define([], definition);
    }
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = DoF;
    }
    // Fall back to a global variable
    else {
        window[name] = definition();
    }
}('DoF',
    function () {
        var defaults = {
                focalLength: 35, // Number, in millimeters; this must be the actual focal length, not the 35mm equivalent value
                aperture: 2,     // String in the format `"f/2.5"`, or the float value `2.5`
                cropFactor: 1,   // Sensor crop factor (compared to full frame; 2 = half the size)
                distance: 20     // Distance to the subject (feet)
            },
            apertureRegex = /^f\/(\d+(?:\.\d+)?)$/,
            _feetToFloat = function _feetToFloat(dist) {
                var parts = /^(\d+(?:\.\d+)?)\'\s+(\d+(?:\.\d+)?)\"$/.exec(dist),
                    feet = parseFloat(parts[1]),
                    inches = parseFloat(parts[2]);

                return parseFloat(feet + (inches / 12));
            };

        /**
         * Lens constructor
         *
         * @param  {Number}  focalLength  Actual local length in millimeters
         * @param  {Mixed}   aperture     Aperture as a float or a string like "f/2.5"
         * @param  {Number}  cropFactor       Sensor crop factor
         * @param  {Mixed}   id           Optional, arbitrary ID for tracking by the consumer
         * @param  {Mixed}   name         Optional, arbitrary name for tracking by the consumer
         */
        function DoF(focalLength, aperture, cropFactor, id, name) {
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
        }

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

        /**
         * Convert millimeters to decimal feet and inches
         *
         * @param  dist     Length in millimeters
         * @return {String} Length (feet/inches), or infinity
         */
        DoF.prototype._mmToFeet = function _mmToFeet(dist) {
            var feet, inches;

            // Convert millimeters to inches
            dist = dist / 25.4;

            return dist === Infinity ? Infinity
                   : Math.floor(dist / 12) + "' " + (dist % 12).toFixed(1) + '"';
        };

        DoF.prototype._calculate = function _calculate(focalLength, aperture, cropFactor, distance) {
            var result = {},
                hf, near, far, dof,
                dofFeet, eighthDofFeet, hfFeet, nearFeet, farFeet;

            // Convert to millimeters
            distance = distance * 12 * 25.4;

            // Get 35mm-equivalent focal length
            result.focalLengthEquiv = Math.round10(cropFactor * focalLength);

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
            dofFeet = this._mmToFeet(dof);
            result.toString = function() {
                return dofFeet;
            };

            result.toString.dof = dofFeet;
            result.dof = _feetToFloat(result.toString.dof);
            result.toString.eighthDof = this._mmToFeet(dof / 8);
            result.eighthDof = _feetToFloat(result.toString.eighthDof);
            result.toString.hf = this._mmToFeet(hf);
            result.hf = _feetToFloat(result.toString.hf);
            result.toString.near = this._mmToFeet(near);
            result.near = _feetToFloat(result.toString.near);
            result.toString.far = this._mmToFeet(far);
            result.far = _feetToFloat(result.toString.far);

            return result;
        };

        DoF.prototype.result = function _result(distance) {
            var that = this;

            if (isNaN(distance)) {
                distance = defaults.distance;
            }
            else if (typeof distance === 'string') {
                distance = parseFloat(distance);
            }

            return that._calculate(that.focalLength, that.aperture, that.cropFactor, distance);
        };

        return DoF;
    }
));

// Math.round10 polyfill for decimal rounding
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Example:_Decimal_rounding
    // Decimal round
    if (!Math.round10) {
        /**
         * Decimal adjustment of a number.
         *
         * @param   {String}    type    The type of adjustment.
         * @param   {Number}    value   The number.
         * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
         * @returns {Number}            The adjusted value.
         */
        var decimalAdjust = function _decimalAdjust(type, value, exp) {
            // If the exp is undefined or zero...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // If the value is not a number or the exp is not an integer...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // Shift
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Shift back
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        };

        Math.round10 = function _math_round10(value) {
            return decimalAdjust('round', value, -1);
        };
    }
})();

