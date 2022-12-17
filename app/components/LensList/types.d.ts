type SensorKey = import('./sensorList').SensorKey

interface Inputs {
    id: string
    name: string
    focalLength: number
    aperture: string
    sensorKey: SensorKey
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

type SelectedItem = LensProperties['id']
