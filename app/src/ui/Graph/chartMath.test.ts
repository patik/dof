import { clampSeriesAtInfinity, createChartScales, getTickValues, layoutEndLabels } from './chartMath'
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
    test('clamps a series at its first infinite result', () => {
        expect(clampSeriesAtInfinity(series)).toEqual({
            finitePoints: series.points.slice(0, 3),
            infinityAt: 15,
        })
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
})
