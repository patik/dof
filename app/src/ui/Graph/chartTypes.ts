export type ChartScaleMode = 'linear' | 'log'

export type ChartPoint = {
    distance: number
    dof: number
}

export type ChartSeries = {
    id: string
    lensId: LensDefinition['id']
    hyperfocal: number
    points: ChartPoint[]
}

export type PositionedLabel = {
    id: string
    y: number
}
