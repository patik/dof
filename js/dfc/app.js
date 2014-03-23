var DFC = (function _DFC() {
    var
        // List of all lenses
        lenses = [],

        // Globals
        template = null,
        distance = 20,

        // Cached element queries
        $body = null,
        $main = null,
        $distance = null,
        $addLens = null,
        $sortToggle = null,
        $sortOptions = null,
        $comparisonLinks = null,

        // Sorting API
        _sorting = {},

        // Chart
        _chart = {},
        $chart = null,
        dofChart = null;

    /**
     * Initialize app
     */
    function _init() {
        template = Handlebars.compile($("#lens-template").html());
        $main = $('[role="main"]');
        $body = $('body');
        $distance = $('.distance');
        $addLens = $('.add-lens');
        $sortToggle = $('.sort-toggle');
        $sortOptions = $('.table-header > .row');
        $comparisonLinks = $('.comparison-link, .subheader a');

        //To do: watch hashchange(?) event
        _readLensesFromHash();

        // Make sure there's at least one Lens object
        if (!lenses.length) {
            _createNewLens();
        }

        // Clear any existing lens UIs
        $('[role="main"]').find('.lens').remove();

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
            .on('change keyup blur', '.name, .focalLength, .aperture, .sensor', _onChangeLensValue)
            .on('keydown', '.name', _onChangeLensValue)

            // Show/hide additional results
            .on('click', '.output-toggle', _toggleOutputs)

            // Sorting
            .on('click', '[data-sort]', _sortLenses)
            .on('click', '.sort-toggle', _sortToggle)

            // Custom events
            .on('uiupdated', _onUIUpdated);

        // Distance
        $distance.on('change keyup blur', _onChangeDistance);

        // Setup existing lens UIs
        $.each(lenses, function(i, lens) {
            _addLensUI(lens);
            lens = _getNameFromUI(lens);
        });

        $chart = $('#dofChart');
        _chart.create();
    }

    _chart.data = {
        labels: ["5'", "10'", "15'", "20'", "25'", "30'", "35'", "40'", "45'", "50'"],
        datasets: [
            {
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                data : [5,10,15,20,25,30,35]
            },
            {
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                pointColor : "rgba(151,187,205,1)",
                pointStrokeColor : "#fff",
                data : [5,15,25,35,45,55,65]
            }
        ]
    };

    _chart.options = {
        scaleOverlay: false, //Boolean - If we show the scale above the chart data
        scaleOverride: false, //Boolean - If we want to override with a hard coded scale
        scaleSteps: null, //Number - The number of steps in a hard coded scale. ** Required if scaleOverride is true **
        scaleStepWidth: null, //Number - The value jump in the hard coded scale
        scaleStartValue: null, //Number - The scale starting value
        scaleLineColor: 'rgba(0,0,0,.1)', //String - Colour of the scale line
        scaleLineWidth: 1, //Number - Pixel width of the scale line
        scaleShowLabels: true, //Boolean - Whether to show labels on the scale
        scaleLabel: '<%=value%>', //Interpolated JS string - can access value
        scaleFontSize: 12, //Number - Scale label font size in pixels
        scaleFontStyle: 'normal', //String - Scale label font weight style
        scaleFontColor: '#666',     //String - Scale label font colour
        scaleShowGridLines: true, //Boolean - Whether grid lines are shown across the chart
        scaleGridLineColor: 'rgba(0,0,0,.05)', //String - Colour of the grid lines
        scaleGridLineWidth: 1,  //Number - Width of the grid lines
        bezierCurve: true, //Boolean - Whether the line is curved between points
        pointDot: true, //Boolean - Whether to show a dot for each point
        pointDotRadius: 3, //Number - Radius of each point dot in pixels
        pointDotStrokeWidth: 1, //Number - Pixel width of point dot stroke
        datasetStroke: true, //Boolean - Whether to show a stroke for datasets
        datasetStrokeWidth: 2, //Number - Pixel width of dataset stroke
        animation: true, //Boolean - Whether to animate the chart
        animationSteps: 60, //Number - Number of animation steps
        animationEasing: 'easeOutQuart', //String - Animation easing effect
        onAnimationComplete: null, //Function - Fires when the animation is complete

        // Customized
        scaleFontFamily: 'Open Sans', //String - Scale label font declaration for the scale label
        datasetFill: false //Boolean - Whether to fill the dataset with a colour
    };

    _chart.create = function _chart_creat() {
        dofChart = new Chart($chart.get(0).getContext('2d')).Line(_chart.data, _chart.options);
    };

    // example.com/#20;Name%20of%20Lens,35,f-2,mft
    function _readLensesFromHash() {
        var hash = window.location.hash.replace(/^\#/, '');

        if (!hash) {
            return false;
        }

        hash = hash.split(';');

        distance = parseFloat(hash.shift());
        $distance.val(distance);

        hash.forEach(function (config) {
            var lens = _createNewLens(),
                props = config.split(',');

            // Get each property but quit if any were empty
            lens.name = decodeURIComponent(props[0]).trim();
            if (!lens.name) { return true; }

            lens.focalLength = parseInt(props[1], 10);
            if (isNaN(lens.focalLength)) { return true; }

            lens.aperture = decodeURIComponent(props[2]).trim().replace('-', '/');
            if (!lens.aperture) { return true; }

            lens.sensor = props[3].trim();
            if (!lens.sensor) { return true; }

            _updateLens(lens.id, 'name', lens.name);
            _updateLens(lens.id, 'focalLength', lens.focalLength);
            _updateLens(lens.id, 'aperture', lens.aperture);
            _updateLens(lens.id, 'sensor', lens.sensor);
        });
    }

    // example.com/#20;Name%20of%20Lens,35,f-2,mft
    function _updateHash() {
        var hash = '',
            lensHashes = [];

        $.each(lenses, function(i, lens) {
            var pieces = [], apt;

            pieces.push(encodeURIComponent(lens.name));
            pieces.push(lens.focalLength);

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

        if (lensHashes.length || distance !== 20) {
            hash = '#' + distance + ';' + lensHashes.join(';');
        }

        window.location.hash = hash;
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
                name: lens.name,
                focalLength: lens.focalLength
            };

        return $(template(context));
    }

    function _duplicateLensUI(evt) {
        var sourceId = $(evt.target).data('lens-id'),
            sourceLens = _getLensById(sourceId),
            lens = _createNewLens(),
            prop, $config;

        evt.preventDefault();

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
        $config.insertBefore($addLens);

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

            // Update UI
            $lens.find('.focalLength').val(35);
            $lens.find('.aperture').val(DFC.aperture.getSize(lens.aperture));
            $lens.find('.sensor').find('[data-sensor-key="APSCCanon"]').attr('selected','selected');

            _updateOuput(lens.id, $lens);
        }
    }

    /**
     * Toggle the visibility of additional outputs
     * `this` refers to the toggle button
     * @param  {Event} evt  Click event
     */
    function _toggleOutputs(evt) {
        $(this).closest('.lens').find('.outputs').toggleClass('collapsed');
    }

    /**
     * Updates aspects of the page when the UI has changed
     *
     * @param   {Event}  evt   Custom event
     */
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

    /**
     * Updates each lens with a new distance value
     *
     * @param   {Event}  evt   Change event
     */
    function _onChangeDistance(evt) {
        distance = parseFloat($distance.val());

        $.each(lenses, function(i, lens) {
            _updateOuput(lens.id, $('form[data-lens-id="' + lens.id + '"'));
        });

        _updateHash();
    }

    /**
     * Updates a lens when one of its input values changes
     *
     * @param   {Event}  evt   Change, blur, or key event
     */
    function _onChangeLensValue(evt) {
        var $input = $(this),
            propRegex = /\b(name|focalLength|aperture|sensor)\b/,
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

    /**
     * Updates a single property for a Lens object
     *
     * @param   {String}  id    Lens ID
     * @param   {String}  prop  Property name
     * @param   {Mixed}  val    New value
     * @return  {DFC.Lens}      Updated lens object
     */
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

    /**
     * Creates a new Lens object
     *
     * @param   {String}  id  Lens ID
     * @return  {DFC.Lens}    Lens object
     */
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

        if (!lens.name) {
            lens.name = 'Lens ' + id;
        }

        // Store it
        lenses.push(lens);

        return lens;
    }

    /**
     * Finds a Lens object based on its ID
     *
     * @param   {String}  id  Lens ID to search for
     * @return  {DFC.Lens}    Lens object
     */
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
     *
     * @param   {String}  id          Lens ID
     * @param   {jQuery}  $container  Container jQuery element
     */
    function _updateOuput(id, $container) {
        var lens, result, dof;

        // Triggered by an event
        if (typeof id === 'object' && id.target) {
            $container = $(id.target).closest('.lens');
            id = $container.data('lens-id');
        }

        lens = _getLensById(id);

        if (!lens || !$container || !$container.length) {
            return;
        }

        result = new DFC.Dof(lens.sensor, lens.focalLength, lens.aperture, distance);

        // Add a space before single digit numbers to make them align vertically
        dof = result.dof
                .toString()
                .replace(/^(\d)\'/, ' $1\'')
                .replace(/\s(\d)\./, '  $1.');

        // Display values
        $container.find('.dof').text(dof);
        $container.find('.eighthDof').text(result.eighthDof);
        $container.find('.coc').text(result.coc + ' mm');
        $container.find('.hf').text(result.hf);
        $container.find('.neardist').text(result.near);
        $container.find('.fardist').text(result.far);
        $container.find('.focalLengthEquiv').text(result.focalLengthEquiv + 'mm');

        _updateLens(id, 'dof', result.dofFloat);
    }

    /////////////
    // Sorting //
    /////////////

    /**
     * Settings for the current/last column to be sorted
     * @type  {Object}
     */
    _sorting.settings = {};

    function _sortToggle(evt) {
        evt.preventDefault();

        if ($sortToggle.is('.expanded')) {
            // Collapse menu
            $sortToggle.removeClass('expanded');
            $sortOptions.removeClass('expanded');
            $body.off('click', _onSortToggleBodyClick);
        }
        else {
            // Expand menu
            $sortToggle.addClass('expanded');
            $sortOptions.addClass('expanded');
            $body.on('click', _onSortToggleBodyClick);
        }
    }

    function _onSortToggleBodyClick(evt) {
        var $targ = $(evt.target);

        // Click on menu item
        if ($targ.closest('.row.expanded').length) {
            console.log('Click on menu item');
            _sortToggle(evt);
        }
        // Clicked outside the menu
        else if (!$targ.closest('.sort-toggle').length) {
            console.log('Clicked outside the menu');
            // Collapse menu
            $('.sort-toggle').removeClass('expanded');
            $sortOptions.removeClass('expanded');
            $body.off('click', _onSortToggleBodyClick);
        }
    }

    /**
     * Sorts lenses by a particular property and updates the view
     *
     * @param   {Event}  evt   Click event
     */
    function _sortLenses(evt) {
        var $targ = $(evt.target);

        // Collect settings
        _sorting.settings.type = $targ.data('sort');
        _sorting.settings.dir = $targ.attr('data-sort-dir');

        // Sort array
        lenses.sort(_sorting.compare);

        // Clear out UI
        $('[role="main"]').find('.lens').remove();

        // Re-add all lenses
        $.each(lenses, function(i, lens) {
            _addLensUI(lens);
        });

        // Change direction for next time
        if (_sorting.settings.dir === 'desc') {
            $targ.attr('data-sort-dir', 'asc');
        }
        else {
            $targ.attr('data-sort-dir', 'desc');
        }

        // Move arrow to this column
        $('.sorted').removeClass('sorted');
        $targ.addClass('sorted');
    }

    /**
     * Proxy function for comparing two lenses
     * Makes some adjustments to the values being compared
     *     then calls the appropriate less-than function
     *
     * @param   {DFC.Lens}  a  First lens
     * @param   {DFC.Lens}  b  Second lens
     * @return  {Number}       Result of comparison
     */
    _sorting.compare = function _sorting_compare(a, b) {
        // Get the appropriate values to compare
        if (_sorting.settings.type === 'sensor') {
            a = DFC.sensor.getMultiplier(a.sensor);
            b = DFC.sensor.getMultiplier(b.sensor);
        }
        else if (_sorting.settings.type === 'aperture') {
            a = DFC.aperture.getSize(a.aperture);
            b = DFC.aperture.getSize(b.aperture);
        }
        else {
            a = a[_sorting.settings.type];
            b = b[_sorting.settings.type];
        }

        if (_sorting.settings.dir === 'desc') {
            return _sorting.compareDesc(a, b);
        }
        else {
            return _sorting.compareAsc(a, b);
        }
    };

    /**
     * Less-than function for sorting descending
     *
     * @param   {DFC.Lens}  a  First lens
     * @param   {DFC.Lens}  b  Second les
     * @return  {Number}       Result of comparison
     */
    _sorting.compareDesc = function _sorting_compareDesc(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else { // a == b
            return 0;
        }
    };

    /**
     * Less-than function for sorting ascending
     *
     * @param   {DFC.Lens}  a  First lens
     * @param   {DFC.Lens}  b  Second lens
     * @return  {Number}       Result of comparison
     */
    _sorting.compareAsc = function _sorting_compareAsc(a, b) {
        if (a > b) {
            return -1;
        }
        else if (a < b) {
            return 1;
        }
        else { // a == b
            return 0;
        }
    };

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
