DFC.sensor = (function sensor() {
    // https://en.wikipedia.org/wiki/Image_sensor_format
    // http://www.dpreview.com/previews/panasonic-lumix-dmc-gm1/images/Sensors.png
    var mainList = [
            {
                name: 'iPhone 5',
                value: 7.61
            },
            {
                name: 'Standard 8mm film',
                value: 7.28
            },
            {
                name: 'iPhone 5S, 1/3" CCD',
                value: 7.21
            },
            {
                name: 'Standard 16mm film',
                value: 3.41
            },
            {
                name: '1" CCD, Nikon CX, Sony RX100',
                value: 2.72
            },
            {
                name: 'Blackmagic Cine Cam',
                value: 3.02
            },
            {
                name: 'Four-Thirds',
                value: 2
            },
            {
                name: 'APS-C (Canon EF-S)',
                value: 1.62
            },
            {
                name: 'Standard 35mm film',
                value: 1.59
            },
            {
                name: 'Nikon D3100/D3200',
                value: 1.57
            },
            {
                name: 'APS-C (Nikon, Pentax, Samsung, Sony)',
                value: 1.53
            },
            {
                name: 'Super 35mm film',
                value: 1.39
            },
            {
                name: 'APS-H (Canon 1D)',
                value: 1.29
            },
            {
                name: 'Full Frame',
                value: 1
            },
            {
                name: 'Leica S',
                value: 0.8
            }
        ],

        shortList = [
            {
                name: 'Ultra-compact or iPhone',
                value: 7.21
            },
            {
                name: 'Micro 4/3',
                value: 2,
            },
            {
                name: 'APS-C',
                value: 1.62
            },
            {
                name: 'Full Frame',
                value: 1
            }
        ],

        fullList = shortList.concat(mainList);

    /////////////////////
    // Private methods //
    /////////////////////

    /**
     * Creates the HTML string for a series of `option` elements containing the sensor sizes
     * @param  {String} selectedSize Optional sensor name that should be selected by default
     * @return {String}              HTML of all `<option>`s
     */
    function _createHTML(selectedSize) {
        var html = '<optgroup label="Common Sizes">',
            foundSize = false;

        /**
         * Adds the HTML for an item's `option` element to the main `html` string
         * @param  {Number} i    Index of the array being iterated over
         * @param  {Object} item Sensor size object
         */
        function createOptionHTML(i, item) {
            html += '<option value="' + item.value + '"';

            if (!foundSize && item.name === selectedSize) {
                html += ' selected="selected"';
                foundSize = true;
            }

            html += '>' + item.name + '</option>';
        }

        if (typeof selectedSize === 'number' || !isNaN(selectedSize)) {
            selectedSize = _getNameByMultiplier(selectedSize);
        }

        // Shortlist
        $.each(shortList, createOptionHTML);

        // Separator
        html += '</optgroup><optgroup label="Specific Cameras &amp; Mounts">';

        // Main list
        $.each(mainList, createOptionHTML);

        return html;
    }

    /**
     * Retrieves the multiplier value for a given sensor name
     * @param  {String} name Sensor name
     * @return {Number}      Multiplier value
     */
    function _getMultiplierByName(name) {
        var multiplier = 0;

        $.each(fullList, function(i, size) {
            if (size.name === name) {
                multiplier = size.value;
                return false;
            }
        });

        return multiplier;
    }

    /**
     * Retrieves the sensor name for a given multiplier value
     * @param  {Number} multiplier  Multiplier value
     * @return {String}             Sensor name
     */
    function _getNameByMultiplier(multiplier) {
        var name = '';

        multiplier = parseFloat(multiplier);

        $.each(fullList, function(i, size) {
            if (size.value === multiplier) {
                name = size.name;
                // Quit loop
                return false;
            }
        });

        return name;
    }

    ////////////////////
    // Public methods //
    ////////////////////

    /**
     * Handles requests for the list of sensors as HTML
     * @param  {String} selectedSize Optional sensor size that should be selected by default
     * @return {String}              HTML for the list of `option` elements
     */
    function getHTML(selectedSize) {
        // Validate
        if (typeof selectedSize !== 'string' || !selectedSize) {
            selectedSize = '';
        }

        return _createHTML(selectedSize);
    }

    /**
     * Handles requests for a sensor's multiplier value
     * @param  {String} name User-friendly name of the sensor
     * @return {Number}      Multiplier value
     */
    function getMultiplier(name) {
        // Validate
        if (typeof name !== 'string' || !name) {
            return 0;
        }

        return _getMultiplierByName(name);
    }

    /////////
    // API //
    /////////

    return {
        getHTML: getHTML,
        getMultiplier: getMultiplier
    };
}());
