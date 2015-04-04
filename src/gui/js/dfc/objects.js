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

// Polyfills
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/gm, '');
    };
}
