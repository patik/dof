var DFC = (function _DFC() {
    // List of all lenses
    var lenses = [],
        template = null,
        $main = null;

    /**
     * Initialize app
     */
    function _init() {
        template = Handlebars.compile($("#lens-template").html());
        $main = $('[role="main"]');

        //To do: Read from URL hash and watch hashchange(?) event

        // Make sure there's at least one Lens object
        if (!lenses.length) {
            _createNewLens();
        }

        // Clear any existing lens UIs
        $('[role="main"]').empty();

        // Setup existing lens UIs
        $.each(lenses, function(i, lens) {
            _addLensUI(lens);
        });

        // Event listeners
        $('body')
            // Prevent actual form submission and just update
            .on('submit', 'form', function(evt) {
                evt.preventDefault();
                return false;
            })

            // Add new new
            .on('click', '.add-lens', _addLensUI)

            // Copy existing lens
            .on('click', '.duplicate', _duplicateLensUI)

            // Update existing lens
            .on('change keyup blur', '.focalLength, .aperture, .distance, .sensor', _onChangeLensValue)

            // Show/hide additional results
            .on('click', '.output-toggle', _toggleOutputs);
    }

    function _createLensUI(lens) {
        var context = {
                index: lens.id,
                distance: lens.distance,
                focalLength: lens.focalLength
            };

        return $(template(context));
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
    }

    /**
     * Toggle the visibility of additional outputs
     * `this` refers to the toggle button
     * @param  {Event} evt  Click event
     * @return {[type]}     [description]
     */
    function _toggleOutputs(evt) {
        $(this).closest('.outputs').toggleClass('collapsed');
    }

    function _onChangeLensValue(evt) {
        var $input = $(this),
            propRegex = /\b(focalLength|aperture|distance|sensor)\b/,
            className = $input.attr('class'),
            property;

        // Make sure the field represents a known property type
        if (!propRegex.test(className)) {
            return false;
        }

        id = $input.data('lens-id');
        property = propRegex.exec(className)[1];

        // Update the lens object with the new value
        _updateLens(id, property, $input.val());

        // Update the lens' output
        _updateOuput(id, $input.closest('.lens'));
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
