DFC.sensor = (function sensor() {
    // https://en.wikipedia.org/wiki/Image_sensor_format
    // http://www.dpreview.com/previews/panasonic-lumix-dmc-gm1/images/Sensors.png
    var mainList = [
            {
                name: 'iPhone 5',
                key: 'iPhone5',
                value: 7.61
            },
            {
                name: 'Standard 8mm film',
                key: '8mm',
                value: 7.28
            },
            {
                name: 'iPhone 5S, 1/3" CCD',
                key: 'iPhone5S',
                value: 7.21
            },
            {
                name: 'Standard 16mm film',
                key: '16mm',
                value: 3.41
            },
            {
                name: '1" CCD, Nikon CX, Sony RX100',
                key: '1inch',
                value: 2.72
            },
            {
                name: 'Blackmagic Cine Cam',
                key: 'BlackmagicCC',
                value: 3.02
            },
            {
                name: 'Micro Four-Thirds',
                key: 'mft',
                value: 2
            },
            {
                name: 'APS-C (Canon EF-S)',
                key: 'APSCCanon',
                value: 1.62
            },
            {
                name: 'Standard 35mm film',
                key: '35mm',
                value: 1.59
            },
            {
                name: 'Nikon D3100/D3200',
                key: 'NikonD3k',
                value: 1.57
            },
            {
                name: 'APS-C (Nikon, Pentax, Samsung, Sony)',
                key: 'APSC',
                value: 1.53
            },
            {
                name: 'Super 35mm film',
                key: 'Super35',
                value: 1.39
            },
            {
                name: 'APS-H (Canon 1D)',
                key: 'APSH',
                value: 1.29
            },
            {
                name: 'Full Frame',
                key: 'FullFrame',
                value: 1
            },
            {
                name: 'Leica S',
                key: 'LeicaS',
                value: 0.8
            }
        ],

        shortList = [
            {
                name: 'Ultra-compact or iPhone',
                key: 'iPhone5S',
                value: 7.21
            },
            {
                name: 'Micro 4/3',
                key: 'mft',
                value: 2,
            },
            {
                name: 'APS-C',
                key: 'APSCCanon',
                value: 1.62
            },
            {
                name: 'Full Frame',
                key: 'FullFrame',
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

            if (!foundSize && (item.name === selectedSize || item.key === selectedSize)) {
                html += ' selected="selected"';
                foundSize = true;
            }

            html += ' data-sensor-key="' + item.key + '">' + item.name + '</option>';
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
     * Retrieves the multiplier value for a given sensor key
     * @param  {String} key  Sensor key
     * @return {Number}      Multiplier value
     */
    function _getMultiplierByKey(key) {
        var multiplier = 0;

        $.each(fullList, function(i, size) {
            if (size.key === key) {
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

    /**
     * Retrieves the sensor name for a given key
     * @param  {String}  key  Key name
     * @return {String}       Sensor name
     */
    function _getNameByKey(key) {
        var name = '';

        $.each(fullList, function(i, size) {
            if (size.key === key) {
                name = size.name;
                // Quit loop
                return false;
            }
        });

        return name;
    }

    /**
     * Retrieves the sensor key for a given name
     * @param  {String}  name  Sensor name
     * @return {String}        Key name
     */
    function _getKeyByName(name) {
        var key = '';

        $.each(mainList.concat(shortList), function(i, size) {
            if (size.name === name) {
                key = size.key;
                // Quit loop
                return false;
            }
        });

        return key;
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

        return _getMultiplierByKey(name) || _getMultiplierByName(name);
    }

    /**
     * Retrieves the sensor name for a given key
     * @param  {String}  key  Key name
     * @return {String}       Sensor name
     */
    function getName(key) {
        if (typeof key !== 'string' || !key.trim().length) {
            return '';
        }

        return _getNameByKey(key.trim());
    }

    /**
     * Retrieves the sensor key for a given name
     * @param  {String}  name  Sensor name
     * @return {String}        Key name
     */
    function getKey(name) {
        if (typeof name !== 'string' || !name.trim().length) {
            return '';
        }

        return _getKeyByName(name.trim());
    }

    /////////
    // API //
    /////////

    return {
        getHTML: getHTML,
        getMultiplier: getMultiplier,
        getName: getName,
        getKey: getKey
    };
}());
