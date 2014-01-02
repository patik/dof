// Lens constructor
DFC.Lens = function _Lens(id) {
    // Defaults
    this.id = 0;
    this.name = '';
    this.aperture = 'f/2';
    this.sensor = 'Micro 4/3';
    this.focalLength = 35;
    this.distance = 20;

    // Resolve ID
    if (typeof id === 'number' && id > 0) {
        this.id = id;
    }

    return this;
};

// Depth of field calculation constructor
DFC.Dof = function _Dof(sensor, focalLength, aperture, distance) {
    var hf, near, far, dof;

    /**
     * Convert millimeters to decimal feet and inches
     *
     * @param dist      Length in millimeters
     * @return {String} Length (feet/inches), or infinity
     */
    function _mmToFeet(dist) {
        var feet, inches;

        // Convert millimeters to inches
        dist = dist / 25.4;

        return dist === Infinity ? Infinity
               : Math.floor(dist / 12) + "' " + (dist % 12).toFixed(1) + '"';
    }

    // Get numerical values for the sensor and aperture
    if (typeof sensor === 'string' && isNaN(sensor)) {
        sensor = DFC.sensor.getMultiplier(sensor);
    }

    if (typeof aperture === 'string' && isNaN(aperture)) {
        aperture = DFC.aperture.getSize(aperture);
    }

    // Convert to millimeters
    distance = distance * 12 * 25.4;

    // Convert sensor crop factor to a multiplier
    sensor = 1 / sensor;

    this.coc = Math.round(0.03 * sensor * 1000) / 1000;
    hf = Math.pow(focalLength, 2) / (aperture * this.coc) + (focalLength * 1.0);

    near = (distance * (hf - focalLength)) / (hf + distance + (2 * focalLength));
    far = (distance * (hf - focalLength)) / (hf - distance);

    if (far <= 0) {
        far = Infinity;
        dof = Infinity;
    }
    else {
        dof = far - near;
    }

    // Convert for display
    this.dof = _mmToFeet(dof);
    this.eighthDof = _mmToFeet(dof / 8);
    this.hf = _mmToFeet(hf);
    this.near = _mmToFeet(near);
    this.far = _mmToFeet(far);

    return this;
};
