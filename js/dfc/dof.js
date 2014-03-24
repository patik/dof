(function () {
    var isCommonJS = (typeof module !== 'undefined' && module.exports);

    var defaults = {
        focalLength: 35, // Number, in millimeters; this must be the actual focal length, not the 35mm equivalent value
        aperture: 2, // String in the format `"f/2.5"`, or the float value `2.5`
        sensor: 1,       // Crop factor/multiplier
        distance: 20     // Distance to the subject (feet)
    };

    /**
     * Lens constructor
     *
     * @param  {Number}  focalLength  Actual local length in millimeters
     * @param  {Mixed}   aperture     Aperture as a float or a string like "f/2.5"
     * @param  {Number}  sensor       Sensor crop factor or multiplier
     * @param  {Mixed}   id           Optional, arbitrary ID for tracking by the consumer
     * @param  {Mixed}   name         Optional, arbitrary name for tracking by the consumer
     */
    function DoF(focalLength, aperture, sensor, id, name) {
        var apertureRegex = /^f\/(\d+(?:\.\d+)?)$/;

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

        if (typeof sensor === 'number') {
            this.sensor = sensor;
        }
        else {
            this.sensor = defaults.sensor;
        }

        // Optional properties
        if (typeof id !== 'undefined') {
            this.id = id;
        }

        if (typeof name !== 'undefined') {
            this.name = name;
        }
    }

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

    var _feetToString = function _feetToString(dist) {
        var feet = Math.floor(dist).toString(),
            inchesDecimal = dist % 1;

        return feet + "' " + Math.round10(inchesDecimal * 12) + '"';
    };

    var _feetToFloat = function _feetToFloat(dist) {
        var parts = /^(\d+(?:\.\d+)?)\'\s+(\d+(?:\.\d+)?)\"$/.exec(dist),
            feet = parseFloat(parts[1]),
            inches = parseFloat(parts[2]);

        console.log('feet: ', feet);
        console.log('inches: ', inches);
        console.log('inches, converted: ', inches / 12);
        console.log('total: ', feet + (inches / 12));

        return parseFloat(feet + (inches / 12));
    };

    DoF.prototype._calculate = function _calculate(focalLength, aperture, sensor, distance) {
        var result = {},
            hf, near, far, dof;

        // Convert to millimeters
        distance = distance * 12 * 25.4;

        // Get 35mm-equivalent focal length
        result.focalLengthEquiv = Math.round10(sensor * focalLength);

        // Convert sensor crop factor to a multiplier
        sensor = 1 / sensor;

        result.coc = Math.round(0.03 * sensor * 1000) / 1000;
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
        result.dofFeet = this._mmToFeet(dof);
        result.dof = _feetToFloat(result.dofFeet);
        result.eighthDof = this._mmToFeet(dof / 8);
        result.eighthDofFeet = _feetToString(dof / 8);
        result.hf = this._mmToFeet(hf);
        result.hfFeet = _feetToString(hf);
        result.near = this._mmToFeet(near);
        result.nearFeet = _feetToString(near);
        result.far = this._mmToFeet(far);
        result.farFeet = _feetToString(far);

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

        return that._calculate(that.focalLength, that.aperture, that.sensor, distance);
    };

    // Make the constructor public
    if (isCommonJS) {
        module.exports = DoF;
    }
    else {
        self.DoF = DoF;
    }
}());

// Polyfills
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/gm, '');
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Example:_Decimal_rounding
(function() {
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

        Math.round10 = function(value) {
            return decimalAdjust('round', value, -1);
        };
    }
})();

