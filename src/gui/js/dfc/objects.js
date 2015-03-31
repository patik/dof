// Lens constructor
DFC.Lens = function _Lens(id) {
    // Defaults
    this.id = 0;
    this.name = '';
    this.aperture = 'f/2';
    this.sensor = 'APSC';
    this.focalLength = 35;
    this.dof = -1;

    // Resolve ID
    if (typeof id === 'number' && id > 0) {
        this.id = id;
    }

    return this;
};

// Depth of field calculation constructor
DFC.Dof = function _Dof(sensor, focalLength, aperture, dstnce) {
    var hf;
    var near;
    var far;
    var dof;

    /**
     * Convert millimeters to decimal feet and inches
     *
     * @param  dist     Length in millimeters
     * @return {String} Length (feet/inches), or infinity
     */
    var mmToFeet = function (dist) {
        var feet;
        var inches;

        // Convert millimeters to inches
        dist = dist / 25.4;

        return dist === Infinity ? Infinity
               : Math.floor(dist / 12) + "' " + (dist % 12).toFixed(1) + '"';
    };

    // Get numerical values for the sensor and aperture
    if (typeof sensor === 'string' && isNaN(sensor)) {
        sensor = DFC.sensor.getMultiplier(sensor);
    }

    if (typeof aperture === 'string' && isNaN(aperture)) {
        aperture = DFC.aperture.getSize(aperture);
    }

    // Convert to millimeters
    dstnce = dstnce * 12 * 25.4;

    // Get 35mm-equivalent focal length
    this.focalLengthEquiv = Math.round10(sensor * focalLength);

    // Convert sensor crop factor to a multiplier
    sensor = 1 / sensor;

    this.coc = Math.round(0.03 * sensor * 1000) / 1000;
    hf = Math.pow(focalLength, 2) / (aperture * this.coc) + (focalLength * 1.0);

    near = (dstnce * (hf - focalLength)) / (hf + dstnce + (2 * focalLength));
    far = (dstnce * (hf - focalLength)) / (hf - dstnce);

    if (far <= 0) {
        far = Infinity;
        dof = Infinity;
    }
    else {
        dof = far - near;
    }

    // Convert for display
    this.dofFloat = dof;
    this.dof = mmToFeet(dof);
    this.eighthDof = mmToFeet(dof / 8);
    this.hf = mmToFeet(hf);
    this.near = mmToFeet(near);
    this.far = mmToFeet(far);

    return this;
};

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
