var DFC = (function _DFC() {
    // List of all lenses
    var lenses = [];

    /**
     * Initialize app
     */
    function _init() {
        //To do: Read from URL hash and watch hashchange(?) event

        // Make sure there's at least one Lens object
        if (!lenses.length) {
            _createNewLens();
        }

        // Clear any existing lens UIs
        $('[role="main"]').empty();

        // Setup each lens UI
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
            .on('click', '.duplicate', function(evt) {
                _duplicateLensUI($('.lens').last());
            })

            // Update existing lens
            .on('change keyup blur', '.focalLength, .aperture, .distance, .sensor', _onChangeLensValue)

            // Show/hide additional results
            .on('click', '.output-toggle', _toggleOutputs);
    }

    function _createNewLens(id) {
        var lens;

        // Resolve ID
        if (typeof id === 'string') {
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

    function _addLensUI(lens) {
        var $config;

        if (!lens) {
            setting = _createNewLens();
        }

        $config = _createLensUI(lens);

        _addLensUIToPage($config);

        resetFields($config);
    }

    function _addLensUIToPage($config) {
        // To do: add `div.row` as appropriate?
        $('[role="main"]').append($config);
    }

    function _duplicateLensUI($source) {
        var lastIndex = $source.data('lens-id'),
            lens, $config;

        if (lastIndex) {
            $.each(lenses, function(i, cfg) {
                if (cfg.id === lastIndex) {
                    lens = $.extend(true, {}, cfg);
                    return false;
                }
            });
        }

        if (!lens) {
            lens = _createNewLens();
        }
        else {
            lens.id++;
            lens.name = 'Lens ' + lens.id;
        }

        $config = _createLensUI(lens);

        _addLensUIToPage($config);

        // Set up dropdowns et al
        resetFields($config);

        // Copy the values over
        $.each(['focalLength', 'aperture', 'distance', 'sensor'], function(i, className) {
            $config.find('.' + className).val($source.find('.' + className).val());
        });

        // Update the outputs
        _updateOuput(lens.id, $config);
    }

    function _createLensUI(lens) {
        var $config = $('<form/>'),
            $inputs = $('<div/>'),
            $outputs = $('<table/>'),
            index, name;

        if (!lens) {
            console.log('makign new lens: ', lens);
            lens = _createNewLens();
        }
        else {
            console.log('provided with a lens: ', lens);
        }

        index = lens.id;
        name = lens.name || 'Lens ' + index;

        $config
            .attr('method', 'post')
            .attr('action', 'index.html')
            .attr('data-lens-id', index)
            .addClass('small-12 medium-6 large-4 columns lens');

        $inputs.addClass('inputs');

        // Header
        $('<div/>')
            .addClass('row')
            .append($('<div/>')
                        .addClass('small-8 columns')
                        .html('<h3>' + name + '</h3>')
            )
            .append($('<div/>')
                        .addClass('small-4 columns')
                        .html('<button data-lens-id="' + index + '" class="button rounded secondary tiny duplicate">Copy</button>')
            )
            .appendTo($inputs);

        // First 3 inputs
        $('<div/>')
            .attr('data-lens-id', index)
            .addClass('row')
            // Focal length
            .append(
                $('<div/>')
                    .addClass('small-4 columns')
                    .append($('<label/>')
                                .attr('for', 'focalLength-' + index)
                                .text('Focal length')
                            )
                    .append($('<input/>')
                                .val(lens.focalLength)
                                .addClass('focalLength')
                                .attr('id', 'focalLength-' + index)
                                .attr('type', 'number')
                                .attr('tabindex', '1')
                            )
            )
            // Aperture
            .append(
                $('<div/>')
                    .addClass('small-4 columns')
                    .append($('<label/>')
                                .attr('for', 'aperture-' + index)
                                .text('Aperture')
                            )
                    .append($('<select/>')
                                .addClass('aperture')
                                .attr('id', 'aperture-' + index)
                                .attr('tabindex', '1')
                                .html(DFC.aperture.getHTML(lens.aperture))
                            )
            )
            // Distance
            .append(
                $('<div/>')
                    .addClass('small-4 columns')
                    .append($('<label/>')
                                .attr('for', 'distance-' + index)
                                .text('Distance (ft)')
                            )
                    .append($('<input/>')
                                .val(lens.distance)
                                .addClass('distance')
                                .attr('id', 'distance-' + index)
                                .attr('type', 'number')
                                .attr('tabindex', '1')
                            )
            )
            .appendTo($inputs);

        // Sensor
        $('<div/>')
            .attr('data-lens-id', index)
            .addClass('row')
            .append(
                $('<div/>')
                    .addClass('small-3 columns')
                    .append($('<label/>')
                                .attr('for', 'sensor-' + index)
                                .text('Sensor')
                            )
            )
            .append(
                $('<div/>')
                    .addClass('small-9 columns')
                    .append($('<select/>')
                                .addClass('sensor')
                                .attr('id', 'sensor-' + index)
                                .attr('tabindex', '1')
                                .html(DFC.sensor.getHTML(lens.sensor))
                            )
            )
            .appendTo($inputs);

        // Outputs
        $outputs.addClass('outputs collapsed');

        $outputs.append(
            $('<thead/>')
                .append(
                    $('<tr/>')
                        .append($('<th/>').text('Item'))
                        .append($('<th/>').text('Value'))
                )
        );

        $outputs.append(
            $('<tbody>')
                .append(
                    $('<tr/>')
                        .addClass('dof-display')
                        .append($('<td/>').html('Depth of Field'))
                        .append($('<td/>').html('<span class="dof"></span> <button data-lens-id="' + index + '" class="tiny secondary radius output-toggle"><span>&#9650;</span><span>&#9660;</span></button>'))
                )
                .append(
                    $('<tr/>')
                        .append($('<td/>').html('<abbr title="Circle of confusion">C.o.C.</abbr>'))
                        .append($('<td/>').addClass('coc'))
                )
                .append(
                    $('<tr/>')
                        .append($('<td/>').html('Hyperfocal distance'))
                        .append($('<td/>').addClass('hf'))
                )
                .append(
                    $('<tr/>')
                        .append($('<td/>').html('Near limit'))
                        .append($('<td/>').addClass('neardist'))
                )
                .append(
                    $('<tr/>')
                        .append($('<td/>').html('Far limit'))
                        .append($('<td/>').addClass('fardist'))
                )
                .append(
                    $('<tr/>')
                        .append($('<td/>').html('1/8th depth of field'))
                        .append($('<td/>').addClass('eighthDof'))
                )
        );

        $config
            .append($inputs)
            .append($outputs)
            .attr('data-lens-id', index);

        // Apparently this attribute doesn't stick for form fields until the elements are part of the DOM? Works for divs...
        $config.find('input, select').attr('data-lens-id', index);

        console.log(index, ' config: ', $config.get(0));

        return $config;
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

    /**
     * Reset input fields
     * @param  {jQuery} $container Configuration group to be reset
     * @param  {jQuery} $copyFrom  Optional group to copy values from
     */
    function resetFields($container, $copyFrom) {
        var $sensorSize = $container.find('.sensor'),
            $apertures = $container.find('.aperture'),
            defaults = {};

        // Define initial values
        if ($copyFrom && $copyFrom.length) {
            // Copy from another configuration
            defaults.sensor = $copyFrom.find('.sensor option:selected').text();
            defaults.aperture = $copyFrom.find('.aperture option:selected').text();
            defaults.focalLength = parseInt($copyFrom.find('.focalLength').val(), 10);
            defaults.distance = parseFloat($copyFrom.find('.distance').val());
        }
        else {
            // Use defaults
            defaults = _createNewLens();
        }

        // Populate sensor sizes
        $sensorSize.html(DFC.sensor.getHTML(defaults.sensor));

        // Populate apertures
        $apertures.html(DFC.aperture.getHTML(defaults.aperture));

        // Populate other fields
        $container.find('.focalLength').val(defaults.focalLength);
        $container.find('.distance').val(defaults.distance);

        // Events
        $container.on('change keyup', '.inputs select, .inputs input', _updateOuput);

        // Update output with current values
        _updateOuput($container.data('lens-id'), $container);
    }

    function _onChangeLensValue(evt) {
        var $input = $(this),
            propRegex = /\b(focalLength|aperture|distance|sensor)\b/,
            className = $input.attr('class'),
            property;

        // Make sure the field represents a known property type
        if (!propRegex.test(className)) {
            console.log('nope');
            return false;
        }

        id = $input.data('lens-id');
        property = propRegex.exec(className)[1];

        // console.log('property: ', property);

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
                // console.log('updating lens from ', JSON.parse(JSON.stringify(lenses[i])));
                // console.log('updating lens   to ', JSON.parse(JSON.stringify(lens)));
                lenses[i] = lens;
                return false;
            }
        });

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

        if (!lens) {
            console.error('[_updateOuput] lens not found for ID ', id);
            return;
        }

        console.log('updated output with params: ', lens.sensor, lens.focalLength, lens.aperture, lens.distance);

        result = new DFC.Dof(lens.sensor, lens.focalLength, lens.aperture, lens.distance);
        console.log('resutl: ', result);

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
