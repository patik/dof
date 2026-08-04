import { ticks } from 'd3-array'
import { type ScaleLinear, type ScaleLogarithmic, scaleLinear, scaleLog } from 'd3-scale'
import type { ChartPoint, ChartScaleMode, ChartSeries, PositionedLabel } from './chartTypes'

export type ChartScales = {
    x: ScaleLinear<number, number>
    y: ScaleLinear<number, number> | ScaleLogarithmic<number, number>
    xTicks: number[]
    yTicks: number[]
    /** True when some depths exceed the axis and are drawn beyond the top of the plot. */
    depthClipped: boolean
}

// Depth of field grows without bound as the subject approaches the hyperfocal
// distance, so the last sample before that asymptote can be orders of magnitude
// larger than every other value and would flatten the remaining curves onto the
// axis. A linear depth domain therefore only considers samples comfortably short
// of the hyperfocal distance; anything past it runs off the top of the plot,
// where the hyperfocal marker and infinity region already explain why.
const ASYMPTOTE_SAFE_FRACTION = 0.6

export function clampSeriesAtInfinity(series: ChartSeries): {
    finitePoints: ChartPoint[]
    infinityAt: number | null
} {
    const infinityIndex = series.points.findIndex((point) => !Number.isFinite(point.dof))

    return {
        finitePoints:
            infinityIndex === -1
                ? series.points.filter((point) => Number.isFinite(point.dof))
                : series.points.slice(0, infinityIndex),
        // Depth is infinite from the hyperfocal distance onward, so report that exact
        // threshold rather than the first sample that happens to land past it —
        // otherwise the marker drifts by up to one sampling step.
        infinityAt: infinityIndex === -1 ? null : series.hyperfocal,
    }
}

export function getLinearDepthMax(series: ChartSeries[]): number {
    const perSeriesMax = series.map((item) => {
        const points = clampSeriesAtInfinity(item).finitePoints.filter((point) => point.dof > 0)

        if (points.length === 0) {
            return 0
        }

        const settled = points.filter((point) => point.distance <= item.hyperfocal * ASYMPTOTE_SAFE_FRACTION)
        // A lens whose hyperfocal distance sits below the first sample has no settled
        // region to measure, so fall back to its nearest sample rather than nothing.
        const measured = settled.length > 0 ? settled : points.slice(0, 1)

        return Math.max(...measured.map((point) => point.dof))
    })

    return Math.max(0, ...perSeriesMax)
}

export function getTickValues(domain: [number, number], count: number): number[] {
    const [start, end] = domain
    return ticks(start, end, count)
}

function getLogTicks(domain: [number, number], count: number): number[] {
    const scale = scaleLog<number, number>().domain(domain)
    const candidates = scale.ticks(count)

    if (candidates.length <= count * 2) {
        return candidates
    }

    const stride = Math.ceil(candidates.length / (count * 2))
    return candidates.filter((_, index) => index % stride === 0)
}

export function createChartScales({
    series,
    mode,
    xRange,
    yRange,
    tickCount = 6,
}: {
    series: ChartSeries[]
    mode: ChartScaleMode
    xRange: [number, number]
    yRange: [number, number]
    tickCount?: number
}): ChartScales {
    const allPoints = series.flatMap((item) => clampSeriesAtInfinity(item).finitePoints)
    const maxDistance = Math.max(1, ...series.flatMap((item) => item.points.map((point) => point.distance)))
    const finiteDofValues = allPoints.map((point) => point.dof).filter((value) => Number.isFinite(value) && value > 0)
    const maxDof = finiteDofValues.length > 0 ? Math.max(...finiteDofValues) : 1
    const minPositiveDof = finiteDofValues.length > 0 ? Math.min(...finiteDofValues) : 0.01
    // A log axis absorbs the asymptote on its own, so only the linear axis needs trimming.
    const linearMaxDof = getLinearDepthMax(series) || maxDof
    const xDomain: [number, number] = [0, maxDistance]
    const yDomain: [number, number] = mode === 'log' ? [minPositiveDof, maxDof] : [0, linearMaxDof]
    const x = scaleLinear<number, number>().domain(xDomain).range(xRange).nice(tickCount)
    const y =
        mode === 'log'
            ? scaleLog<number, number>().domain(yDomain).range(yRange).nice()
            : scaleLinear<number, number>().domain(yDomain).range(yRange).nice(tickCount)
    const normalizedXDomain = x.domain() as [number, number]
    const normalizedYDomain = y.domain() as [number, number]

    return {
        x,
        y,
        xTicks: getTickValues(normalizedXDomain, tickCount),
        yTicks:
            mode === 'log' ? getLogTicks(normalizedYDomain, tickCount) : getTickValues(normalizedYDomain, tickCount),
        depthClipped: maxDof > normalizedYDomain[1],
    }
}

export function layoutEndLabels(
    labels: PositionedLabel[],
    { minY, maxY, gap }: { minY: number; maxY: number; gap: number },
): PositionedLabel[] {
    if (labels.length === 0) {
        return []
    }

    const sorted = labels.map((label) => ({ ...label })).sort((a, b) => a.y - b.y)
    const first = sorted[0]
    const last = sorted.at(-1)
    if (!first || !last) {
        return []
    }

    // With more labels than the plot can separate by `gap`, spread them evenly and
    // accept the tighter spacing — letting any of them escape the plot is worse.
    const available = maxY - minY
    if ((sorted.length - 1) * gap > available) {
        const step = sorted.length > 1 ? available / (sorted.length - 1) : 0
        return sorted.map((label, index) => ({ ...label, y: minY + index * step }))
    }

    first.y = Math.max(minY, first.y)
    for (let index = 1; index < sorted.length; index += 1) {
        const previous = sorted[index - 1]
        const current = sorted[index]
        if (!previous || !current) {
            continue
        }
        current.y = Math.max(current.y, previous.y + gap)
    }

    // Pulling the stack back up cannot push the topmost label above `minY`, because
    // the guard above already established that `gap` spacing fits inside the plot.
    const overflow = last.y - maxY
    if (overflow > 0) {
        last.y = maxY
        for (let index = sorted.length - 2; index >= 0; index -= 1) {
            const next = sorted[index + 1]
            const current = sorted[index]
            if (!next || !current) {
                continue
            }
            current.y = Math.min(current.y, next.y - gap)
        }
    }

    return sorted
}

export function findNearestPoint({
    series,
    x,
    y,
    pointerX,
    pointerY,
}: {
    series: ChartSeries[]
    x: ChartScales['x']
    y: ChartScales['y']
    pointerX: number
    pointerY: number
}): { series: ChartSeries; point: ChartPoint; x: number; y: number } | null {
    let nearest: { series: ChartSeries; point: ChartPoint; x: number; y: number; distance: number } | null = null

    for (const item of series) {
        for (const point of item.points) {
            if (point.dof <= 0 || !Number.isFinite(point.dof)) {
                continue
            }

            const pointX = x(point.distance)
            const pointY = y(point.dof)
            const distance = Math.hypot(pointX - pointerX, pointY - pointerY)

            if (!nearest || distance < nearest.distance) {
                nearest = { series: item, point, x: pointX, y: pointY, distance }
            }
        }
    }

    return nearest
}
