DFC.aperture = (function aperture() {
    var sizes = [
            {
                name: 'f/1',
                value: 1
            },
            {
                name: 'f/1.1',
                value: 1.122462
            },
            {
                name: 'f/1.2',
                value: 1.189207
            },
            {
                name: 'f/1.4',
                value: 1.414214
            },
            {
                name: 'f/1.6',
                value: 1.587401
            },
            {
                name: 'f/1.7',
                value: 1.681793
            },
            {
                name: 'f/1.8',
                value: 1.781797
            },
            {
                name: 'f/2',
                value: 2.000000
            },
            {
                name: 'f/2.2',
                value: 2.244924
            },
            {
                name: 'f/2.4',
                value: 2.378414
            },
            {
                name: 'f/2.5',
                value: 2.519842
            },
            {
                name: 'f/2.8',
                value: 2.828427
            },
            {
                name: 'f/3.2',
                value: 3.174802
            },
            {
                name: 'f/3.4',
                value: 3.363586
            },
            {
                name: 'f/3.5',
                value: 3.563595
            },
            {
                name: 'f/3.6',
                value: 3.563595
            },
            {
                name: 'f/4',
                value: 4.000000
            },
            {
                name: 'f/4.5',
                value: 4.489848
            },
            {
                name: 'f/4.8',
                value: 4.756828
            },
            {
                name: 'f/5',
                value: 5.039684
            },
            {
                name: 'f/5.6',
                value: 5.656854
            },
            {
                name: 'f/6.4',
                value: 6.349604
            },
            {
                name: 'f/6.7',
                value: 6.727171
            },
            {
                name: 'f/7.1',
                value: 7.127190
            },
            {
                name: 'f/8',
                value: 8.000000
            },
            {
                name: 'f/9',
                value: 8.979696
            },
            {
                name: 'f/9.5',
                value: 9.513657
            },
            {
                name: 'f/10',
                value: 10.07937
            },
            {
                name: 'f/11',
                value: 11.313708
            },
            {
                name: 'f/12.7',
                value: 12.699208
            },
            {
                name: 'f/13.5',
                value: 13.454343
            },
            {
                name: 'f/14.3',
                value: 14.254379
            },
            {
                name: 'f/16',
                value: 16.000000
            },
            {
                name: 'f/18',
                value: 17.959393
            },
            {
                name: 'f/20',
                value: 20.158737
            },
            {
                name: 'f/22',
                value: 22.627417
            },
            {
                name: 'f/25',
                value: 25.398417
            },
            {
                name: 'f/28',
                value: 28.508759
            },
            {
                name: 'f/32',
                value: 32
            }
        ];

    /////////////////////
    // Private methods //
    /////////////////////

    /**
     * Creates the HTML string for a series of `option` elements containing the aperture sizes
     * @param  {String} selectedAperture  Optional aperture name that should be selected by default
     * @return {String}                   HTML of all `<option>`s
     */
    function _createHTML(selectedAperture) {
        var html = '',
            foundSize = false;

        /**
         * Adds the HTML for an item's `option` element to the main `html` string
         * @param  {Number} i    Index of the array being iterated over
         * @param  {Object} item Aperture object
         */
        function createOptionHTML(i, item) {
            html += '<option value="' + item.value + '"';

            if (!foundSize && item.name === selectedAperture) {
                html += ' selected="selected"';
                foundSize = true;
            }

            html += '>' + item.name + '</option>';
        }

        if (typeof selectedAperture === 'number' || !isNaN(selectedAperture)) {
            selectedAperture = _getNameBySize(selectedAperture);
        }

        // Loop over all apertures
        $.each(sizes, createOptionHTML);

        return html;
    }

    /**
     * Retrieves the multiplier value for a given sensor name
     * @param  {String} name Sensor name
     * @return {Number}      Multiplier value
     */
    function _getSizeByName(name) {
        var size = 0;

        $.each(sizes, function(i, s) {
            if (s.name === name) {
                size = s.value;
                return false;
            }
        });

        return size;
    }

    /**
     * Retrieves the sensor name for a given multiplier value
     * @param  {Number} size Multiplier value
     * @return {String}      Sensor name
     */
    function _getNameBySize(size) {
        var name = '';

        size = parseFloat(size);

        $.each(sizes, function(i, s) {
            if (s.value === size) {
                name = s.name;
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
     * Returns the HTML for the list of sensors
     * @param  {String} selectedAperture  Optional aperture size that should be selected by default
     * @return {String}                   HTML for the list of `option` elements
     */
    function getHTML(selectedAperture) {
        // Validate
        if (typeof selectedAperture !== 'string' || !selectedAperture) {
            selectedAperture = '';
        }

        return _createHTML(selectedAperture);
    }

    /**
     * Handles requests for a aperture's size
     * @param  {String} fstop Human-readable F-stop name
     * @return {Number}       Aperture size
     */
    function getSize(fstop) {
        // Validate
        if (typeof fstop === 'string' && fstop) {
            return _getSizeByName(fstop);
        }

        return 0;
    }

    /**
     * Handles requests for a aperture's size
     * @param  {String} fstop Human-readable F-stop name
     * @return {Number}       Aperture size
     */
    function getName(size) {
        // Validate
        if (typeof size === 'number' && size) {
            return _getNameBySize(size);
        }

        return 0;
    }

    /////////
    // API //
    /////////

    return {
        getHTML: getHTML,
        getSize: getSize,
        getName: getName
    };
}());
