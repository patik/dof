import { line } from 'd3-shape'
import { type PointerEvent, useId, useMemo, useRef, useState } from 'react'
import useDoFStore from '../../store'
import { feetAndInchesString, feetString, rounded } from '../../utilities/conversion'
import { clampSeriesAtInfinity, createChartScales, findNearestPoint, layoutEndLabels } from './chartMath'
import type { ChartPoint, ChartScaleMode, ChartSeries } from './chartTypes'
import useData from './useData'
import useResizeObserver from './useResizeObserver'

const SCALE_STORAGE_KEY = 'dof-chart-scale:v1'
const SERIES_COLOR_COUNT = 6

type HoveredPoint = {
    series: ChartSeries
    point: ChartPoint
    x: number
    y: number
    color: string
}

function readScaleMode(): ChartScaleMode {
    try {
        return localStorage.getItem(SCALE_STORAGE_KEY) === 'log' ? 'log' : 'linear'
    } catch {
        return 'linear'
    }
}

function seriesColor(index: number): string {
    return `var(--series-${(index % SERIES_COLOR_COUNT) + 1})`
}

function formatNumber(value: number): string {
    if (value >= 100) {
        return Math.round(value).toLocaleString()
    }

    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(rounded(value))
}

function formatDistance(value: number, units: Units): string {
    return units === 'imperial' ? feetString(value) : `${formatNumber(value)} m`
}

function formatDepth(value: number, units: Units): string {
    return units === 'imperial' ? feetAndInchesString(value) : `${formatNumber(value)} m`
}

export default function Graph() {
    const { units } = useDoFStore()
    const data = useData()
    const { ref, width } = useResizeObserver<HTMLDivElement>()
    const svgRef = useRef<SVGSVGElement>(null)
    const hoverKeyRef = useRef<string | null>(null)
    const titleId = useId()
    const descriptionId = useId()
    const clipId = useId()
    const [scaleMode, setScaleMode] = useState<ChartScaleMode>(readScaleMode)
    const [hovered, setHovered] = useState<HoveredPoint | null>(null)
    const compact = width < 640
    const height = compact ? 430 : 470
    const margin = {
        top: compact ? 68 : 74,
        right: compact ? 84 : 154,
        bottom: 62,
        left: compact ? 58 : 72,
    }
    const plotRight = width - margin.right
    const plotBottom = height - margin.bottom
    const scales = useMemo(
        () =>
            createChartScales({
                series: data,
                mode: scaleMode,
                xRange: [margin.left, plotRight],
                yRange: [plotBottom, margin.top],
                tickCount: compact ? 4 : 6,
            }),
        [compact, data, margin.left, margin.top, plotBottom, plotRight, scaleMode],
    )
    const plottedSeries = useMemo(
        () =>
            data.map((series, index) => {
                const clamped = clampSeriesAtInfinity(series)
                const points = clamped.finitePoints.filter((point) => scaleMode === 'linear' || point.dof > 0)
                const path = line<ChartPoint>()
                    .x((point) => scales.x(point.distance))
                    .y((point) => scales.y(point.dof))(points)
                const lastPoint = points.at(-1)

                return {
                    ...series,
                    ...clamped,
                    points,
                    path,
                    color: seriesColor(index),
                    lastPoint,
                }
            }),
        [data, scaleMode, scales.x, scales.y],
    )
    const labelPositions = useMemo(() => {
        const labels = plottedSeries.flatMap((series) =>
            series.lastPoint ? [{ id: series.lensId, y: scales.y(series.lastPoint.dof) }] : [],
        )
        return new Map(
            layoutEndLabels(labels, { minY: margin.top + 10, maxY: plotBottom - 10, gap: compact ? 16 : 19 }).map(
                (label) => [label.id, label.y],
            ),
        )
    }, [compact, margin.top, plotBottom, plottedSeries, scales.y])
    const infinityMarkers = plottedSeries.filter(
        (series): series is (typeof plottedSeries)[number] & { infinityAt: number } => series.infinityAt !== null,
    )

    const changeScale = (nextMode: ChartScaleMode) => {
        setScaleMode(nextMode)
        setHovered(null)
        hoverKeyRef.current = null
        try {
            localStorage.setItem(SCALE_STORAGE_KEY, nextMode)
        } catch {
            // Storage can be unavailable; the chart still keeps the in-memory choice.
        }
    }

    const handlePointerMove = (event: PointerEvent<SVGRectElement>) => {
        const svg = svgRef.current
        if (!svg) {
            return
        }

        const bounds = svg.getBoundingClientRect()
        const pointerX = (event.clientX - bounds.left) * (width / bounds.width)
        const pointerY = (event.clientY - bounds.top) * (height / bounds.height)
        const nearest = findNearestPoint({ series: data, x: scales.x, y: scales.y, pointerX, pointerY })

        if (!nearest) {
            return
        }

        const key = `${nearest.series.lensId}:${nearest.point.distance}`
        if (hoverKeyRef.current === key) {
            return
        }

        hoverKeyRef.current = key
        const color = plottedSeries.find((series) => series.lensId === nearest.series.lensId)?.color ?? seriesColor(0)
        setHovered({ ...nearest, color })
    }

    const clearHover = () => {
        hoverKeyRef.current = null
        setHovered(null)
    }

    return (
        <section
            ref={ref}
            aria-labelledby="chart-heading"
            className="overflow-hidden rounded-panel border border-line bg-panel shadow-[var(--soft-shadow)]"
        >
            <header className="flex flex-col gap-4 border-b border-line px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                <div>
                    <p className="mb-1 text-caption font-semibold tracking-caption text-accent-strong uppercase">
                        Focus field
                    </p>
                    <h2 id="chart-heading" className="font-display text-2xl font-medium text-ink sm:text-3xl">
                        Depth across distance
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted">
                        Compare how quickly each lens gains usable focus as the subject moves away.
                    </p>
                </div>
                <fieldset className="w-fit rounded-control border border-line bg-canvas p-1" aria-label="Depth scale">
                    <legend className="sr-only">Depth scale</legend>
                    {(['linear', 'log'] as const).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            aria-pressed={scaleMode === mode}
                            onClick={() => changeScale(mode)}
                            className={`rounded-[0.55rem] px-3 py-1.5 text-xs font-semibold tracking-wide capitalize transition-colors ${
                                scaleMode === mode ? 'bg-accent-strong text-accent-ink' : 'text-muted hover:text-ink'
                            }`}
                        >
                            {mode}
                        </button>
                    ))}
                </fieldset>
            </header>

            <div className="relative bg-panel-raised">
                <svg
                    ref={svgRef}
                    role="img"
                    aria-labelledby={`${titleId} ${descriptionId}`}
                    viewBox={`0 0 ${width} ${height}`}
                    className="block h-auto w-full select-none"
                >
                    <title id={titleId}>Depth of field by subject distance for each lens</title>
                    <desc id={descriptionId}>
                        {`A ${scaleMode} scale line chart comparing ${data.length} ${data.length === 1 ? 'lens' : 'lenses'}. Hyperfocal distances and where depth becomes infinite are marked. The lens table above presents the same calculations as accessible text.`}
                    </desc>
                    <defs>
                        <clipPath id={clipId}>
                            <rect
                                x={margin.left}
                                y={margin.top}
                                width={Math.max(0, plotRight - margin.left)}
                                height={plotBottom - margin.top}
                            />
                        </clipPath>
                        <pattern id={`${clipId}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M-2 2 2-2M0 8 8 0M6 10 10 6" stroke="var(--line)" strokeWidth="1" />
                        </pattern>
                    </defs>

                    {infinityMarkers.length > 0 ? (
                        <rect
                            x={scales.x(Math.min(...infinityMarkers.map((series) => series.infinityAt)))}
                            y={margin.top}
                            width={Math.max(
                                0,
                                plotRight - scales.x(Math.min(...infinityMarkers.map((series) => series.infinityAt))),
                            )}
                            height={plotBottom - margin.top}
                            fill={`url(#${clipId}-hatch)`}
                            opacity="0.45"
                            clipPath={`url(#${clipId})`}
                        />
                    ) : null}

                    {scales.yTicks.map((tick) => (
                        <g key={`y-${tick}`}>
                            <line
                                x1={margin.left}
                                x2={plotRight}
                                y1={scales.y(tick)}
                                y2={scales.y(tick)}
                                stroke="var(--line)"
                                strokeWidth="1"
                            />
                            <text
                                x={margin.left - 10}
                                y={scales.y(tick)}
                                dy="0.34em"
                                textAnchor="end"
                                fill="var(--muted)"
                                fontSize={compact ? 10 : 11}
                            >
                                {formatNumber(tick)}
                            </text>
                        </g>
                    ))}
                    {scales.xTicks.map((tick) => (
                        <g key={`x-${tick}`}>
                            <line
                                x1={scales.x(tick)}
                                x2={scales.x(tick)}
                                y1={margin.top}
                                y2={plotBottom}
                                stroke="var(--line)"
                                strokeWidth="1"
                                strokeDasharray="2 6"
                            />
                            <text
                                x={scales.x(tick)}
                                y={plotBottom + 22}
                                textAnchor="middle"
                                fill="var(--muted)"
                                fontSize={compact ? 10 : 11}
                            >
                                {formatNumber(tick)}
                            </text>
                        </g>
                    ))}

                    <line
                        x1={margin.left}
                        x2={plotRight}
                        y1={plotBottom}
                        y2={plotBottom}
                        stroke="var(--ink)"
                        strokeWidth="1.25"
                    />
                    <line
                        x1={margin.left}
                        x2={margin.left}
                        y1={margin.top}
                        y2={plotBottom}
                        stroke="var(--ink)"
                        strokeWidth="1.25"
                    />
                    <text
                        x={(margin.left + plotRight) / 2}
                        y={height - 17}
                        textAnchor="middle"
                        fill="var(--ink)"
                        fontSize="12"
                        fontWeight="600"
                    >
                        {`Subject distance (${units === 'imperial' ? 'ft' : 'm'})`}
                    </text>
                    <text
                        x="17"
                        y={(margin.top + plotBottom) / 2}
                        textAnchor="middle"
                        fill="var(--ink)"
                        fontSize="12"
                        fontWeight="600"
                        transform={`rotate(-90 17 ${(margin.top + plotBottom) / 2})`}
                    >
                        {`Depth of field (${units === 'imperial' ? 'ft' : 'm'})`}
                    </text>

                    <g clipPath={`url(#${clipId})`}>
                        {plottedSeries.map((series, index) => {
                            const markerX = Math.min(plotRight, Math.max(margin.left, scales.x(series.hyperfocal)))
                            const [, maxDistance = 0] = scales.x.domain()
                            const isBeyondRange = series.hyperfocal > maxDistance
                            return (
                                <g key={`hyperfocal-${series.lensId}`}>
                                    <line
                                        x1={markerX}
                                        x2={markerX}
                                        y1={margin.top}
                                        y2={plotBottom}
                                        stroke={series.color}
                                        strokeWidth="1.25"
                                        strokeDasharray="5 5"
                                        opacity="0.7"
                                    />
                                    <text
                                        x={Math.min(markerX + 4, plotRight - 4)}
                                        y={margin.top + 13 + (index % 3) * 14}
                                        textAnchor={markerX > plotRight - 80 ? 'end' : 'start'}
                                        fill={series.color}
                                        fontSize={compact ? 9 : 10}
                                        fontWeight="700"
                                    >
                                        {`H ${series.id} ${formatDistance(series.hyperfocal, units)}${isBeyondRange ? ' →' : ''}`}
                                    </text>
                                </g>
                            )
                        })}

                        {plottedSeries.map((series) => (
                            <g key={series.lensId}>
                                {series.path ? (
                                    <path
                                        d={series.path}
                                        fill="none"
                                        stroke={series.color}
                                        strokeWidth={compact ? 2.25 : 2.75}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                ) : null}
                                {series.points.map((point) => (
                                    <circle
                                        key={`${series.lensId}-${point.distance}`}
                                        cx={scales.x(point.distance)}
                                        cy={scales.y(point.dof)}
                                        r={compact ? 2.6 : 3.25}
                                        fill="var(--panel-raised)"
                                        stroke={series.color}
                                        strokeWidth="1.75"
                                    />
                                ))}
                            </g>
                        ))}

                        {hovered ? (
                            <g pointerEvents="none">
                                <line
                                    x1={hovered.x}
                                    x2={hovered.x}
                                    y1={margin.top}
                                    y2={plotBottom}
                                    stroke="var(--ink)"
                                    strokeWidth="1"
                                    strokeDasharray="3 4"
                                    opacity="0.7"
                                />
                                <line
                                    x1={margin.left}
                                    x2={plotRight}
                                    y1={hovered.y}
                                    y2={hovered.y}
                                    stroke="var(--ink)"
                                    strokeWidth="1"
                                    strokeDasharray="3 4"
                                    opacity="0.42"
                                />
                                <circle
                                    cx={hovered.x}
                                    cy={hovered.y}
                                    r="6"
                                    fill="var(--panel-raised)"
                                    stroke={hovered.color}
                                    strokeWidth="3"
                                />
                            </g>
                        ) : null}
                    </g>

                    {infinityMarkers.map((series, index) => {
                        const markerX = scales.x(series.infinityAt)
                        return (
                            <g key={`infinity-${series.lensId}`}>
                                <line
                                    x1={markerX}
                                    x2={markerX}
                                    y1={margin.top}
                                    y2={plotBottom}
                                    stroke={series.color}
                                    strokeWidth="1.5"
                                    strokeDasharray="2 4"
                                />
                                <text
                                    x={Math.min(markerX + 5, plotRight - 4)}
                                    y={plotBottom - 9 - index * 15}
                                    textAnchor={markerX > plotRight - 120 ? 'end' : 'start'}
                                    fill={series.color}
                                    fontSize={compact ? 9 : 10}
                                    fontWeight="700"
                                >
                                    {`∞ ${series.id} beyond ${formatDistance(series.infinityAt, units)}`}
                                </text>
                            </g>
                        )
                    })}

                    {plottedSeries.map((series) => {
                        if (!series.lastPoint) {
                            return null
                        }

                        const pointY = scales.y(series.lastPoint.dof)
                        const labelY = labelPositions.get(series.lensId) ?? pointY
                        const startX = scales.x(series.lastPoint.distance)
                        const endX = Math.min(width - 6, plotRight + (compact ? 8 : 13))
                        return (
                            <g key={`label-${series.lensId}`}>
                                <path
                                    d={`M${startX.toFixed(1)} ${pointY.toFixed(1)} L${(endX - 5).toFixed(1)} ${labelY.toFixed(1)}`}
                                    fill="none"
                                    stroke={series.color}
                                    strokeWidth="1.25"
                                    opacity="0.7"
                                />
                                <text
                                    x={endX}
                                    y={labelY}
                                    dy="0.34em"
                                    fill={series.color}
                                    fontSize={compact ? 10 : 12}
                                    fontWeight="700"
                                >
                                    {compact && series.id.length > 10 ? `${series.id.slice(0, 9)}…` : series.id}
                                </text>
                            </g>
                        )
                    })}

                    <rect
                        data-testid="chart-pointer-area"
                        x={margin.left}
                        y={margin.top}
                        width={Math.max(0, plotRight - margin.left)}
                        height={plotBottom - margin.top}
                        fill="transparent"
                        style={{ touchAction: 'none' }}
                        onPointerMove={handlePointerMove}
                        onPointerLeave={clearHover}
                    />
                </svg>

                {hovered ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="pointer-events-none absolute z-10 max-w-60 rounded-control border bg-panel-raised px-3 py-2 text-xs text-ink shadow-xl"
                        style={{
                            borderColor: hovered.color,
                            left: Math.max(8, Math.min(width - 248, hovered.x + (hovered.x > width - 270 ? -248 : 14))),
                            top: Math.max(8, hovered.y - 34),
                        }}
                    >
                        <strong className="mb-1 block" style={{ color: hovered.color }}>
                            {hovered.series.id}
                        </strong>
                        {`DoF is ${formatDepth(hovered.point.dof, units)} for a subject that is ${formatDistance(hovered.point.distance, units)} away`}
                    </div>
                ) : null}
            </div>
        </section>
    )
}
