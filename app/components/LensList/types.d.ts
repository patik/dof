interface Inputs {
    name: string
    focalLength: number
    aperture: string
    sensor: number
}

interface LensProperties extends Inputs {
    depthOfField: number
}

type ColumnName = keyof LensProperties

interface HeadCell {
    disablePadding: boolean
    id: ColumnName
    label: string
    numeric: boolean
}

type Order = 'asc' | 'desc'
