var DFC = (function _DFC() {
    // List of all lenses
    var lenses = []

    // Globals
    var template = null
    var distance = 20

    // Cached element queries
    var $body = null
    var $main = null
    var $distance = null
    var $addLens = null
    var $sortToggle = null
    var $sortOptions = null
    var $comparisonLinks = null

    // Sorting API
    var _sorting = {}

    // Chart API
    var _chart = {}

    /**
     * Initialize app
     */
    function _init() {
        template = Handlebars.compile($('#lens-template').html())
        $main = $('[role="main"]')
        $body = $('body')
        $distance = $('.distance')
        $addLens = $('.add-lens')
        $sortToggle = $('.sort-toggle')
        $sortOptions = $('.table-header > .row')
        $comparisonLinks = $('.comparison-link, .subheader a')

        //To do: watch hashchange(?) event
        _readLensesFromHash()

        // Make sure there's at least one Lens object
        if (!lenses.length) {
            _createNewLens()
        }

        // Clear any existing lens UIs
        $('[role="main"]').find('.lens').remove()

        // Event listeners
        $body
            // Prevent actual form submission and just update
            .on('submit', 'form', function (evt) {
                evt.preventDefault()
                return false
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
            .on('uiupdated', _onUIUpdated)
            .on('updatechart', _chart.update)

        // Distance
        $distance.on('change keyup blur', _onChangeDistance)

        // Setup existing lens UIs
        $.each(lenses, function (i, lens) {
            _addLensUI(lens)
            lens = _getNameFromUI(lens)
        })

        // Chart
        Highcharts.setOptions({
            chart: {
                type: 'line',
                animation: false,
                style: {
                    fontFamily: '"Open Sans", sans-serif',
                },
            },
            plotOptions: {
                series: {
                    animation: false,
                },
            },
        })

        _chart.update()
    }

    // example.com/#20;Name%20of%20Lens,35,f-2,mft
    function _readLensesFromHash() {
        var hash = window.location.hash.replace(/^\#/, '')

        if (!hash) {
            return false
        }

        hash = hash.split(';')

        distance = parseFloat(hash.shift())
        $distance.val(distance)

        hash.forEach(function (config) {
            var lens = _createNewLens(),
                props = config.split(',')

            // Get each property but quit if any were empty
            lens.name = decodeURIComponent(props[0]).trim()
            if (!lens.name) {
                return true
            }

            lens.focalLength = parseInt(props[1], 10)
            if (isNaN(lens.focalLength)) {
                return true
            }

            lens.aperture = decodeURIComponent(props[2]).trim().replace('-', '/')
            if (!lens.aperture) {
                return true
            }

            lens.sensor = props[3].trim()
            if (!lens.sensor) {
                return true
            }

            _updateLens(lens.id, 'name', lens.name)
            _updateLens(lens.id, 'focalLength', lens.focalLength)
            _updateLens(lens.id, 'aperture', lens.aperture)
            _updateLens(lens.id, 'sensor', lens.sensor)
        })
    }

    // example.com/#20;Name%20of%20Lens,35,f-2,mft
    function _updateHash() {
        var hash = '',
            lensHashes = []

        $.each(lenses, function (i, lens) {
            var pieces = [],
                apt

            pieces.push(encodeURIComponent(lens.name))
            pieces.push(lens.focalLength)

            if (lens.aperture.indexOf('/') !== -1) {
                apt = lens.aperture.replace('/', '-')
            } else {
                apt = DFC.aperture.getName(parseFloat(lens.aperture)).replace('/', '-')
            }

            pieces.push(apt)
            pieces.push(lens.sensor)

            lensHashes.push(pieces.join(','))
        })

        if (lensHashes.length || distance !== 20) {
            hash = '#' + distance + ';' + lensHashes.join(';')
        }

        window.location.hash = hash
        $comparisonLinks.attr('href', window.location.href)
    }

    function _getNameFromUI(lens) {
        if (!lens.name) {
            // Get lens name from DOM
            lens.name = $('[data-lens-id="' + lens.id + '"].name')
                .val()
                .trim()
        }

        return lens
    }

    function _addLensUI(lens) {
        var $config

        // `lens` is an event or not provided
        if (!lens || lens.target) {
            lens = _createNewLens()
        }

        $config = _createLensUI(lens)

        _addLensUIToPage($config, lens)
    }

    function _createLensUI(lens) {
        var context = {
            index: lens.id,
            name: lens.name,
            focalLength: lens.focalLength,
        }

        return $(template(context))
    }

    function _duplicateLensUI(evt) {
        var sourceId = $(evt.target).data('lens-id')
        var sourceLens = _getLensById(sourceId)
        var lens = _createNewLens()
        var prop
        var $config

        evt.preventDefault()

        if (!sourceLens) {
            sourceLens = _createNewLens()
        }

        // Copy values
        for (prop in sourceLens) {
            if (sourceLens.hasOwnProperty(prop) && prop !== 'id') {
                _updateLens(lens.id, prop, sourceLens[prop])
            }
        }

        // If the name is just the default, update it
        if (/^Lens\s+\d+$/.test(lens.name)) {
            _updateLens(lens.id, 'name', 'Lens ' + lens.id)
        }

        $config = _createLensUI(lens)

        _addLensUIToPage($config, lens)
    }

    function _addLensUIToPage($config, lens) {
        // To do: add `div.row` as appropriate?
        $config.insertBefore($addLens)

        // Populate dropdowns
        $config.find('.sensor').html(DFC.sensor.getHTML(lens.sensor))
        $config.find('.aperture').html(DFC.aperture.getHTML(lens.aperture))

        // Update the outputs
        _updateOuput(lens.id, $config.closest('.lens'))

        lens = _getNameFromUI(lens)

        $body.trigger('uiupdated')
    }

    function _deleteLensUI(evt) {
        var $targ = $(evt.target)
        var id = $targ.data('lens-id')
        var lens = _getLensById(id)
        var index = lenses.indexOf(lens)

        evt.preventDefault()

        if (index > -1) {
            // Remove from list
            lenses.splice(index, 1)

            // Remove UI
            $targ.closest('.lens').remove()
            $body.trigger('uiupdated')
        }
    }

    function _resetLensUI(evt) {
        var $targ = $(evt.target)
        var id = $targ.data('lens-id')
        var lens = _getLensById(id)
        var $lens = $targ.closest('.lens')
        var defaults
        var prop

        evt.preventDefault()

        if (lens) {
            defaults = new DFC.Lens()

            // Copy default values
            for (prop in defaults) {
                if (defaults.hasOwnProperty(prop) && prop !== 'id' && prop !== 'name') {
                    _updateLens(lens.id, prop, defaults[prop])
                }
            }

            // Update UI
            $lens.find('.focalLength').val(35)
            $lens.find('.aperture').val(DFC.aperture.getSize(lens.aperture))
            $lens.find('.sensor').find('[data-sensor-key="APSC"]').attr('selected', 'selected')

            _updateOuput(lens.id, $lens)
        }
    }

    /**
     * Toggle the visibility of additional outputs
     * `this` refers to the toggle button
     * @param  {Event} evt  Click event
     */
    function _toggleOutputs(evt) {
        $(this).closest('.lens').find('.outputs').toggleClass('collapsed')
    }

    /**
     * Updates aspects of the page when the UI has changed
     *
     * @param   {Event}  evt   Custom event
     */
    function _onUIUpdated(evt) {
        // Hide 'delete' link if there's only one lens
        if ($('.lens').length === 1) {
            $('.delete').hide()
        } else {
            $('.delete').show()
        }

        // Update the URL hash
        _updateHash()

        $body.trigger('updatechart')
    }

    /**
     * Updates each lens with a new distance value
     *
     * @param   {Event}  evt   Change event
     */
    function _onChangeDistance(evt) {
        distance = parseFloat($distance.val())

        $.each(lenses, function (i, lens) {
            _updateOuput(lens.id, $('form[data-lens-id="' + lens.id + '"'))
        })

        _updateHash()
    }

    /**
     * Updates a lens when one of its input values changes
     *
     * @param   {Event}  evt   Change, blur, or key event
     */
    function _onChangeLensValue(evt) {
        var $input = $(this)
        var propRegex = /\b(name|focalLength|aperture|sensor)\b/
        var className = $input.attr('class')
        var property
        var value

        // Make sure the field represents a known property type
        if (!propRegex.test(className)) {
            return false
        }

        // Get the property name
        id = $input.data('lens-id')
        property = propRegex.exec(className)[1]

        // Get the new value
        if (property === 'name') {
            // Stop the event if the user pressed the enter or escape keys
            if (evt.type.indexOf('key') === 0 && (evt.which === 13 || evt.which === 27)) {
                evt.preventDefault()
                $input.val($input.val().replace(/\n/g, ''))
                $input.blur()
            }

            value = $input.val().trim()
        } else if (property === 'sensor') {
            value = $input.find('option:selected').data('sensor-key')
        } else {
            value = $input.val()
        }

        // Update the lens object with the new value
        _updateLens(id, property, value)

        // Update the lens' output
        _updateOuput(id, $input.closest('.lens'))

        // Update the URL hash
        _updateHash()
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
        var lens = _getLensById(id)

        // Update object
        if (lens.hasOwnProperty(prop)) {
            lens[prop] = val
        }

        // Replace item in array with updated object
        $.each(lenses, function (i, lens) {
            if (lens.id === id) {
                lenses[i] = lens
                return false
            }
        })

        return lens
    }

    /**
     * Creates a new Lens object
     *
     * @param   {String}  id  Lens ID
     * @return  {DFC.Lens}    Lens object
     */
    function _createNewLens(id) {
        var lens

        // Resolve ID
        if (typeof id === 'string' && id) {
            id = parseInt(id, 10)
        }

        if (typeof id !== 'number' || isNaN(id) || id < 1) {
            id = lenses.length + 1
        }

        // Create Lens object
        lens = new DFC.Lens(id)

        if (!lens.name) {
            lens.name = 'Lens ' + id
        }

        // Store it
        lenses.push(lens)

        return lens
    }

    /**
     * Finds a Lens object based on its ID
     *
     * @param   {String}  id  Lens ID to search for
     * @return  {DFC.Lens}    Lens object
     */
    function _getLensById(id) {
        var foundLens = null

        $.each(lenses, function (i, lens) {
            if (lens.id === id) {
                foundLens = lens
                return false
            }
        })

        return foundLens
    }

    /**
     * Update display with calculated values
     *
     * @param   {String}  id          Lens ID
     * @param   {jQuery}  $container  Container jQuery element
     */
    function _updateOuput(id, $container) {
        var lens
        var result
        var depth

        // Triggered by an event
        if (typeof id === 'object' && id.target) {
            $container = $(id.target).closest('.lens')
            id = $container.data('lens-id')
        }

        lens = _getLensById(id)

        if (!lens || !$container || !$container.length) {
            return
        }

        result = new DoF(lens.focalLength, lens.aperture, DFC.sensor.getMultiplier(lens.sensor)).getResult(distance)

        // Add a space before single digit numbers to make them align vertically
        depth = result.toString.dof
            .toString()
            .replace(/^(\d)\'/, " $1'")
            .replace(/\s(\d)\./, '  $1.')

        // Display values
        $container.find('.dof').text(depth)
        $container.find('.eighthDof').text(result.eighthDof)
        $container.find('.coc').text(result.coc + ' mm')
        $container.find('.hf').text(result.hf)
        $container.find('.neardist').text(result.near)
        $container.find('.fardist').text(result.far)
        $container.find('.focalLengthEquiv').text(result.focalLengthEquiv + 'mm')

        _updateLens(id, 'dof', result.dof)

        $body.trigger('updatechart')
    }

    /**
     * Determine the depth-of-field for a given lens
     *
     * @param   {Object}  lens      Lens object
     * @param   {Number}  distance  Distance value
     *
     * @return  {String}            Depth of field in feet and inches
     */
    function _getDof(lens, distance) {
        if (!lens || typeof distance !== 'number') {
            return
        }

        return new DoF(lens.focalLength, lens.aperture, DFC.sensor.getMultiplier(lens.sensor)).getResult(distance)
            .toString.dof
    }

    ///////////
    // Chart //
    ///////////

    // Default data for rendering the chart
    _chart.data = {
        series: [], // Will be populated with the data points
        title: {
            text: 'Sample Depths of Field for These Lenses',
        },
        xAxis: {
            categories: [], // Will be populated along with the data points
            title: {
                text: 'Distance to subject (feet)',
            },
        },
        yAxis: {
            title: {
                text: 'Depth of Field (feet)',
            },
        },
    }

    /**
     * Draws the chart using the current data
     */
    _chart.draw = function _chart_create() {
        $('.chart').highcharts(_chart.data)
    }

    /**
     * Updates the chart data
     */
    _chart.update = function _chart_update() {
        var distances
        var mostDataPoints = 0

        // Update the chart once per series of changes, rather than every single change
        if (_chart.timer) {
            return false
        }

        _chart.timer = setTimeout(_chart.clearTimer, 1000)

        distances = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

        // Clear existing data
        _chart.data.series = []

        // Create data set for each lens
        lenses.forEach(function (lens, i) {
            var graphLine = {
                name: lens.name,
                data: [],
            }
            var mostDataPoints = 0

            // Collect dof for each distance
            distances.forEach(function (distance) {
                var dof = _getDof(lens, distance)
                var regex = /(\d+)\'\s(\d+\.\d+)\"/
                var dec = 0
                var numeric

                // Convert to decimal values
                if (regex.test(dof)) {
                    numeric = regex.exec(dof)
                    dec = parseFloat(parseInt(numeric[1], 10) + parseFloat(numeric[2] / 12))
                }

                // Filter out impractical values
                if (dec > 0 && dec < 200) {
                    graphLine.data.push(dec)
                }
            })

            // Check if this item has the most plotable data points
            if (graphLine.data.length > mostDataPoints) {
                mostDataPoints = graphLine.data.length
            }

            _chart.data.series.push(graphLine)
        })

        // Track how many x-axis points to show
        if (mostDataPoints < distances.length) {
            distances.splice(distances.length - mostDataPoints + 1, mostDataPoints)
        }

        // Update the x-axis chart option
        _chart.data.xAxis.categories = distances.map(function (i) {
            return i + 'ft'
        })

        // Draw updated chart
        _chart.draw()
    }

    // Tracks whether there is a pending re-draw of the chart
    _chart.timer = null

    // Clears the re-draw flag
    _chart.clearTimer = function _chart_clearTimer() {
        clearTimeout(_chart.timer)
        _chart.timer = null
    }

    /////////////
    // Sorting //
    /////////////

    /**
     * Settings for the current/last column to be sorted
     * @type  {Object}
     */
    _sorting.settings = {}

    function _sortToggle(evt) {
        evt.preventDefault()

        if ($sortToggle.is('.expanded')) {
            // Collapse menu
            $sortToggle.removeClass('expanded')
            $sortOptions.removeClass('expanded')
            $body.off('click', _onSortToggleBodyClick)
        } else {
            // Expand menu
            $sortToggle.addClass('expanded')
            $sortOptions.addClass('expanded')
            $body.on('click', _onSortToggleBodyClick)
        }
    }

    function _onSortToggleBodyClick(evt) {
        var $targ = $(evt.target)

        // Click on menu item
        if ($targ.closest('.row.expanded').length) {
            _sortToggle(evt)
        }
        // Clicked outside the menu
        else if (!$targ.closest('.sort-toggle').length) {
            // Collapse menu
            $('.sort-toggle').removeClass('expanded')
            $sortOptions.removeClass('expanded')
            $body.off('click', _onSortToggleBodyClick)
        }
    }

    /**
     * Sorts lenses by a particular property and updates the view
     *
     * @param   {Event}  evt   Click event
     */
    function _sortLenses(evt) {
        var $targ = $(evt.target)

        // Collect settings
        _sorting.settings.type = $targ.data('sort')
        _sorting.settings.dir = $targ.attr('data-sort-dir')

        // Sort array
        lenses.sort(_sorting.compare)

        // Clear out UI
        $('[role="main"]').find('.lens').remove()

        // Re-add all lenses
        $.each(lenses, function (i, lens) {
            _addLensUI(lens)
        })

        // Change direction for next time
        if (_sorting.settings.dir === 'desc') {
            $targ.attr('data-sort-dir', 'asc')
        } else {
            $targ.attr('data-sort-dir', 'desc')
        }

        // Move arrow to this column
        $('.sorted').removeClass('sorted')
        $targ.addClass('sorted')
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
            a = DFC.sensor.getMultiplier(a.sensor)
            b = DFC.sensor.getMultiplier(b.sensor)
        } else if (_sorting.settings.type === 'aperture') {
            a = DFC.aperture.getSize(a.aperture)
            b = DFC.aperture.getSize(b.aperture)
        } else {
            a = a[_sorting.settings.type]
            b = b[_sorting.settings.type]
        }

        if (_sorting.settings.dir === 'desc') {
            return _sorting.compareDesc(a, b)
        } else {
            return _sorting.compareAsc(a, b)
        }
    }

    /**
     * Less-than function for sorting descending
     *
     * @param   {DFC.Lens}  a  First lens
     * @param   {DFC.Lens}  b  Second les
     * @return  {Number}       Result of comparison
     */
    _sorting.compareDesc = function _sorting_compareDesc(a, b) {
        if (a < b) {
            return -1
        } else if (a > b) {
            return 1
        } else {
            // a == b
            return 0
        }
    }

    /**
     * Less-than function for sorting ascending
     *
     * @param   {DFC.Lens}  a  First lens
     * @param   {DFC.Lens}  b  Second lens
     * @return  {Number}       Result of comparison
     */
    _sorting.compareAsc = function _sorting_compareAsc(a, b) {
        if (a > b) {
            return -1
        } else if (a < b) {
            return 1
        } else {
            // a == b
            return 0
        }
    }

    // Init on document ready
    $(document).ready(_init)

    return {}
})()

// Enable FastClick
$(function () {
    if (typeof FastClick !== 'undefined') {
        FastClick.attach(document.body)
    }
})

// Polyfills
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/gm, '')
    }
}
