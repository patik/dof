var DFC = (function _DFC() {
    // List of all lenses
    var lenses = [],
        template = null,
        $body = null,
        $main = null,
        $comparisonLinks = null;

    /**
     * Initialize app
     */
    function _init() {
        var $ghost = $('<div/>');

        template = Handlebars.compile($("#lens-template").html());
        $main = $('[role="main"]');
        $body = $('body');
        $comparisonLinks = $('.comparison-link');

        //To do: watch hashchange(?) event
        _readLensesFromHash();

        // Make sure there's at least one Lens object
        if (!lenses.length) {
            _createNewLens();
        }

        // Clear any existing lens UIs
        $('[role="main"]').empty();

        // Event listeners
        $body
            // Prevent actual form submission and just update
            .on('submit', 'form', function(evt) {
                evt.preventDefault();
                return false;
            })

            // Add new new
            .on('click', '.add-lens', _addLensUI)

            // Copy existing lens
            .on('click', '.duplicate', _duplicateLensUI)

            // Delete existing lens
            .on('click', '.delete', _deleteLensUI)

            // Reset lens properties
            .on('click', '.reset', _resetLensUI)

            // Update existing lens
            .on('change keyup blur', '.name, .focalLength, .aperture, .distance, .sensor', _onChangeLensValue)
            .on('keydown', '.name', _onChangeLensValue)

            // Show/hide additional results
            .on('click', '.output-toggle', _toggleOutputs)

            .on('uiupdated', _onUIUpdated);

        // Setup existing lens UIs
        $.each(lenses, function(i, lens) {
            _addLensUI(lens);
            lens = _getNameFromUI(lens);
        });

        // "Add Lens" ghost block
        $ghost
            .addClass('small-12 medium-6 large-4 columns add-lens ghost')
            .html('<div>Add Lens</div>')
            .appendTo($main);
    }

    // example.com/#Name%20of%20Lens,35,f-2,20,mft
    function _readLensesFromHash() {
        var hash = window.location.hash.replace(/^\#/, '');

        if (!hash) {
            return false;
        }

        hash.split('|').forEach(function (config) {
            var lens = _createNewLens(),
                props = config.split(',');

            // Get each property but quit if any were empty
            lens.name = decodeURIComponent(props[0]).trim();
            if (!lens.name) { return true; }

            lens.focalLength = parseInt(props[1], 10);
            if (isNaN(lens.focalLength)) { return true; }

            lens.distance = parseInt(props[2], 10);
            if (isNaN(lens.distance)) { return true; }

            lens.aperture = decodeURIComponent(props[3]).trim().replace('-', '/');
            if (!lens.aperture) { return true; }

            lens.sensor = props[4].trim();
            if (!lens.sensor) { return true; }

            _addLensUI(lens);
        });
    }

    // example.com/#Name%20of%20Lens,35,f-2,20,mft
    function _updateHash() {
        var hash = '',
            lensHashes = [];

        $.each(lenses, function(i, lens) {
            var pieces = [], apt;

            pieces.push(encodeURIComponent(lens.name));
            pieces.push(lens.focalLength);
            pieces.push(lens.distance);

            if (lens.aperture.indexOf('/') !== -1) {
                apt = lens.aperture.replace('/', '-');
            }
            else {
                apt = DFC.aperture.getName(parseFloat(lens.aperture)).replace('/', '-');
            }

            pieces.push(apt);
            pieces.push(lens.sensor);

            lensHashes.push(pieces.join(','));
        });

        if (lensHashes.length) {
            window.location.hash = '#' + lensHashes.join('|');
        }
        else {
            window.location.hash = '';
        }

        $comparisonLinks.attr('href', window.location.href);
    }

    function _getNameFromUI(lens) {
        if (!lens.name) {
            // Get lens name from DOM
            lens.name = $('[data-lens-id="' + lens.id + '"].name').text().trim();
        }

        return lens;
    }

    function _addLensUI(lens) {
        var $config;

        // `lens` is an event or not provided
        if (!lens || lens.target) {
            lens = _createNewLens();
        }

        $config = _createLensUI(lens);

        _addLensUIToPage($config, lens);
    }

    function _createLensUI(lens) {
        var context = {
                index: lens.id,
                distance: lens.distance,
                focalLength: lens.focalLength
            };

        return $(template(context));
    }

    function _duplicateLensUI(evt) {
        var sourceId = $(evt.target).data('lens-id'),
            sourceLens = _getLensById(sourceId),
            lens = _createNewLens(),
            prop, $config;

        if (!sourceLens) {
            sourceLens = _createNewLens();
        }

        // Copy values
        for (prop in sourceLens) {
            if (sourceLens.hasOwnProperty(prop) && prop !== 'id') {
                _updateLens(lens.id, prop, sourceLens[prop]);
            }
        }

        // If the name is just the default, update it
        if (/^Lens\s+\d+$/.test(lens.name)) {
            _updateLens(lens.id, 'name', 'Lens ' + lens.id);
        }

        $config = _createLensUI(lens);

        _addLensUIToPage($config, lens);
    }

    function _addLensUIToPage($config, lens) {
        // To do: add `div.row` as appropriate?
        $main.append($config);

        // Populate dropdowns
        $config.find('.sensor').html(DFC.sensor.getHTML(lens.sensor));
        $config.find('.aperture').html(DFC.aperture.getHTML(lens.aperture));

        // Update the outputs
        _updateOuput(lens.id, $config.closest('.lens'));

        lens = _getNameFromUI(lens);

        $body.trigger('uiupdated');
    }

    function _deleteLensUI(evt) {
        var $targ = $(evt.target),
            id = $targ.data('lens-id'),
            lens = _getLensById(id),
            index = lenses.indexOf(lens);

        evt.preventDefault();

        if (index > -1) {
            // Remove from list
            lenses.splice(index, 1);

            // Remove UI
            $targ.closest('.lens').remove();
            $body.trigger('uiupdated');
        }
    }

    function _resetLensUI(evt) {
        var $targ = $(evt.target),
            id = $targ.data('lens-id'),
            lens = _getLensById(id),
            $lens = $targ.closest('.lens'),
            $defaults, prop;

        evt.preventDefault();

        if (lens) {
            defaults = new DFC.Lens();

            // Copy default values
            for (prop in defaults) {
                if (defaults.hasOwnProperty(prop) && prop !== 'id' && prop !== 'name') {
                    _updateLens(lens.id, prop, defaults[prop]);
                }
            }

            $lens.find('.focalLength').val(35);
            $lens.find('.aperture').val(DFC.aperture.getSize(lens.aperture));
            $lens.find('.distance').val(20);
            $lens.find('.sensor').find('[data-sensor-key="mft"]').attr('selected','selected');

            _updateOuput(lens.id, $lens);
        }
    }

    /**
     * Toggle the visibility of additional outputs
     * `this` refers to the toggle button
     * @param  {Event} evt  Click event
     */
    function _toggleOutputs(evt) {
        $(this).closest('.outputs').toggleClass('collapsed');
    }

    function _onUIUpdated(evt) {
        // Hide 'delete' link if there's only one lens
        if ($('.lens').length === 1) {
            $('.delete').hide();
        }
        else {
            $('.delete').show();
        }

        // Update the URL hash
        _updateHash();
    }

    function _onChangeLensValue(evt) {
        var $input = $(this),
            propRegex = /\b(name|focalLength|aperture|distance|sensor)\b/,
            className = $input.attr('class'),
            property, value;

        // Make sure the field represents a known property type
        if (!propRegex.test(className)) {
            return false;
        }

        // Get the property name
        id = $input.data('lens-id');
        property = propRegex.exec(className)[1];

        // Get the new value
        if (property === 'name') {
            // Stop the event if the user pressed the enter or escape keys
            if (evt.type.indexOf('key') === 0 && (evt.which === 13 || evt.which === 27)) {
                evt.preventDefault();
                $input.text($input.text().replace(/\n/g, ''));
                $input.blur();
            }

            value = $input.text().trim();
        }
        else if (property === 'sensor') {
            value = $input.find('option:selected').data('sensor-key');
        }
        else {
            value = $input.val();
        }

        // Update the lens object with the new value
        _updateLens(id, property, value);

        // Update the lens' output
        _updateOuput(id, $input.closest('.lens'));

        // Update the URL hash
        _updateHash();
    }

    function _updateLens(id, prop, val) {
        var lens = _getLensById(id);

        // Update object
        if (lens.hasOwnProperty(prop)) {
            lens[prop] = val;
        }

        // Replace item in array with updated object
        $.each(lenses, function(i, lens) {
            if (lens.id === id) {
                lenses[i] = lens;
                return false;
            }
        });

        return lens;
    }

    function _createNewLens(id) {
        var lens;

        // Resolve ID
        if (typeof id === 'string' && id) {
            id = parseInt(id, 10);
        }

        if (typeof id !== 'number' || isNaN(id) || id < 1) {
            id = lenses.length + 1;
        }

        // Create Lens object
        lens = new DFC.Lens(id);

        // Store it
        lenses.push(lens);

        return lens;
    }

    function _getLensById(id) {
        var foundLens = null;

        $.each(lenses, function(i, lens) {
            if (lens.id === id) {
                foundLens = lens;
                return false;
            }
        });

        return foundLens;
    }

    /**
     * Update display with calculated values
     */
    function _updateOuput(id, $container) {
        var lens, result;

        // Triggered by an event
        if (typeof id === 'object' && id.target) {
            $container = $(id.target).closest('.lens');
            id = $container.data('lens-id');
        }

        lens = _getLensById(id);

        if (!lens || !$container || !$container.length) {
            return;
        }

        result = new DFC.Dof(lens.sensor, lens.focalLength, lens.aperture, lens.distance);

        // Display values
        $container.find('.dof').text(result.dof);
        $container.find('.eighthDof').text(result.eighthDof);
        $container.find('.coc').text(result.coc + ' mm');
        $container.find('.hf').text(result.hf);
        $container.find('.neardist').text(result.near);
        $container.find('.fardist').text(result.far);
    }

    // Init on document ready
    $(document).ready(_init);

    return {};
}());

// Enable FastClick
$(function() {
    if(typeof FastClick !== 'undefined') {
        FastClick.attach(document.body);
    }
});
