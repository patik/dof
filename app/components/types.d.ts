type SensorKey = import('./LensList/sensorList').SensorKey

interface LensInputs {
    id: string
    name: string
    focalLength: number
    aperture: string
    sensorKey: SensorKey
}

interface LensDefinition extends LensInputs {
    depthOfField: number
}

type ColumnName = keyof LensDefinition

interface HeadCell {
    disablePadding: boolean
    id: ColumnName
    label: string
    numeric: boolean
}

type Order = 'asc' | 'desc'

type SelectedItem = LensDefinition['id']
