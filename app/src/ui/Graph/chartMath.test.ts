import {
    clampSeriesAtInfinity,
    createChartScales,
    findNearestPoint,
    getLinearDepthMax,
    getTickValues,
    layoutEndLabels,
} from './chartMath'
import type { ChartSeries } from './chartTypes'

const series: ChartSeries = {
    id: '35mm',
    lensId: 'lens-1',
    hyperfocal: 12,
    points: [
        { distance: 0, dof: 0 },
        { distance: 5, dof: 1.5 },
        { distance: 10, dof: 8 },
        { distance: 15, dof: Infinity },
        { distance: 20, dof: Infinity },
    ],
}

describe('chart math', () => {
    test('clamps a series at its first infinite result and reports the hyperfocal threshold', () => {
        expect(clampSeriesAtInfinity(series)).toEqual({
            finitePoints: series.points.slice(0, 3),
            // Not 15: depth is already infinite at the hyperfocal distance, one sample earlier.
            infinityAt: 12,
        })
    })

    test('reports no infinity threshold when every sampled depth is finite', () => {
        expect(clampSeriesAtInfinity({ ...series, points: series.points.slice(0, 3) }).infinityAt).toBeNull()
    })

    test('creates a continuous linear distance scale and linear depth scale', () => {
        const scales = createChartScales({ series: [series], mode: 'linear', xRange: [10, 210], yRange: [100, 0] })

        expect(scales.x(5)).toBeCloseTo((scales.x(0) + scales.x(10)) / 2)
        expect(scales.y.domain()[0]).toBe(0)
        expect(scales.xTicks.length).toBeGreaterThan(2)
        expect(scales.yTicks.length).toBeGreaterThan(2)
    })

    test('keeps the log depth scale strictly positive', () => {
        const scales = createChartScales({ series: [series], mode: 'log', xRange: [0, 200], yRange: [100, 0] })

        expect(scales.y.domain()[0]).toBeGreaterThan(0)
        expect(scales.y(1.5)).toBeGreaterThan(scales.y(8))
    })

    test('generates stable numeric ticks', () => {
        expect(getTickValues([0, 25], 5)).toEqual([0, 5, 10, 15, 20, 25])
    })

    test('nudges overlapping end labels apart within the plot', () => {
        const labels = layoutEndLabels(
            [
                { id: 'a', y: 20 },
                { id: 'b', y: 22 },
                { id: 'c', y: 24 },
            ],
            { minY: 10, maxY: 45, gap: 12 },
        )

        expect(labels.map(({ y }) => y)).toEqual([20, 32, 44])
    })

    test('pulls end labels back up when spreading them overflows the plot', () => {
        const labels = layoutEndLabels(
            [
                { id: 'a', y: 38 },
                { id: 'b', y: 39 },
                { id: 'c', y: 40 },
            ],
            { minY: 10, maxY: 44, gap: 12 },
        )

        expect(labels.map(({ y }) => y)).toEqual([20, 32, 44])
    })

    test('keeps end labels inside the plot when they cannot all fit', () => {
        const labels = layoutEndLabels(
            [
                { id: 'a', y: 10 },
                { id: 'b', y: 10 },
                { id: 'c', y: 10 },
            ],
            { minY: 10, maxY: 20, gap: 12 },
        )

        expect(labels.every(({ y }) => y >= 10 && y <= 20)).toBe(true)
    })
})

describe('linear depth ceiling', () => {
    // Depth of field runs away as the subject nears the hyperfocal distance, so a
    // sample taken just short of it dwarfs the rest of the chart.
    const runaway: ChartSeries = {
        id: 'runaway',
        lensId: 'lens-1',
        hyperfocal: 20,
        points: [
            { distance: 5, dof: 2 },
            { distance: 10, dof: 5 },
            { distance: 15, dof: 40 },
            { distance: 19, dof: 900 },
        ],
    }
    const settled: ChartSeries = {
        id: 'settled',
        lensId: 'lens-2',
        hyperfocal: 500,
        points: [
            { distance: 5, dof: 1 },
            { distance: 10, dof: 4 },
            { distance: 19, dof: 9 },
        ],
    }

    test('ignores samples taken near the hyperfocal asymptote', () => {
        // Only distances at or below 0.6 * 20 = 12 count toward the ceiling.
        expect(getLinearDepthMax([runaway])).toBe(5)
    })

    test('leaves a series with no asymptote in range at its true maximum', () => {
        expect(getLinearDepthMax([settled])).toBe(9)
    })

    test('takes the largest settled depth across every series', () => {
        expect(getLinearDepthMax([runaway, settled])).toBe(9)
    })

    test('falls back to the nearest sample when the hyperfocal is below the first one', () => {
        expect(getLinearDepthMax([{ ...runaway, hyperfocal: 1 }])).toBe(2)
    })

    test('caps the linear axis and flags the clipping, while log keeps the full range', () => {
        const options = {
            series: [runaway, settled],
            xRange: [0, 200] as [number, number],
            yRange: [100, 0] as [number, number],
        }
        const linear = createChartScales({ ...options, mode: 'linear' })
        const log = createChartScales({ ...options, mode: 'log' })

        expect(linear.y.domain()[1]).toBeLessThan(900)
        expect(linear.depthClipped).toBe(true)
        expect(log.y.domain()[1]).toBeGreaterThanOrEqual(900)
        expect(log.depthClipped).toBe(false)
    })
})

describe('nearest point lookup', () => {
    const scales = createChartScales({
        series: [series],
        mode: 'linear',
        xRange: [0, 200],
        yRange: [100, 0],
    })

    test('returns the point closest to the pointer', () => {
        const nearest = findNearestPoint({
            series: [series],
            x: scales.x,
            y: scales.y,
            pointerX: scales.x(10),
            pointerY: scales.y(8),
        })

        expect(nearest?.point).toEqual({ distance: 10, dof: 8 })
        expect(nearest?.series.lensId).toBe('lens-1')
    })

    test('skips infinite and non-positive depths', () => {
        const nearest = findNearestPoint({
            series: [series],
            x: scales.x,
            y: scales.y,
            // Directly over the infinite sample at distance 15.
            pointerX: scales.x(15),
            pointerY: scales.y(8),
        })

        expect(nearest?.point.distance).toBe(10)
    })

    test('returns null when no series has a plottable point', () => {
        const empty: ChartSeries = { ...series, points: [{ distance: 0, dof: 0 }] }

        expect(findNearestPoint({ series: [empty], x: scales.x, y: scales.y, pointerX: 0, pointerY: 0 })).toBeNull()
    })
})
