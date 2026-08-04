import { ticks } from 'd3-array'
import { type ScaleLinear, type ScaleLogarithmic, scaleLinear, scaleLog } from 'd3-scale'
import type { ChartPoint, ChartScaleMode, ChartSeries, PositionedLabel } from './chartTypes'

export type ChartScales = {
    x: ScaleLinear<number, number>
    y: ScaleLinear<number, number> | ScaleLogarithmic<number, number>
    xTicks: number[]
    yTicks: number[]
}

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
        infinityAt: infinityIndex === -1 ? null : (series.points[infinityIndex]?.distance ?? null),
    }
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
    const maxDof = Math.max(1, ...finiteDofValues)
    const minPositiveDof = Math.min(...finiteDofValues)
    const xDomain: [number, number] = [0, maxDistance]
    const yDomain: [number, number] =
        mode === 'log' ? [Number.isFinite(minPositiveDof) ? minPositiveDof : 0.01, maxDof] : [0, maxDof]
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

    first.y = Math.max(minY, first.y)
    for (let index = 1; index < sorted.length; index += 1) {
        const previous = sorted[index - 1]
        const current = sorted[index]
        if (!previous || !current) {
            continue
        }
        current.y = Math.max(current.y, previous.y + gap)
    }

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

    const underflow = minY - first.y
    if (underflow > 0) {
        for (const label of sorted) {
            label.y += underflow
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
