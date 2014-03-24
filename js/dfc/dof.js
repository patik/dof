(function () {
    var isCommonJS = (typeof module !== 'undefined' && module.exports);

    var defaults = {
        focalLength: 35, // Number, in millimeters; this must be the actual focal length, not the 35mm equivalent value
        aperture: 'f/2', // String in the format `"f/2.5"`, or the float value `2.5`
        sensor: 1 // Crop factor/multiplier
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
            this.aperture = parseFloat(apertureRegex.exec(aperture)[1], 10);
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

    // Make the constructor public
    if (isCommonJS) {
        module.exports = DoF;
    }
    else {
        self.DoF = DoF;
    }
}());
