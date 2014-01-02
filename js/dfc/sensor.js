DFC.sensor = (function sensor() {
    // http://www.dpreview.com/previews/panasonic-lumix-dmc-gm1/images/Sensors.png
    var sizes = [
            {
                name: '1/3" CCD',
                value: 0.139
            },
            {
                name: 'Nikon CX',
                value: 0.37
            },
            {
                name: '1" CCD',
                value: 0.37
            },
            {
                name: 'Blackmagic Cine Cam',
                value: 0.42
            },
            {
                name: 'Four-Thirds',
                value: 0.5
            },
            {
                name: 'APS-C (Canon)',
                value: 0.61728
            },
            {
                name: 'Nikon D3100/D3200',
                value: 0.63694
            },
            {
                name: 'Nikon DX',
                value: 0.65789
            },
            {
                name: 'Super 35',
                value: 0.7143
            },
            {
                name: 'APS-H (Canon)',
                value: 0.7692
            },
            {
                name: 'Full Frame (Nikon FX)',
                value: 1
            },
            {
                name: 'Leica S',
                value: 1.25
            }
        ],

        shortList = [
            {
                name: 'Typical ultra-compact',
                value: 0.139
            },
            {
                name: 'Micro 4/3',
                value: 0.5,
            },
            {
                name: 'APS-C',
                value: 0.625
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
