import { FormControl, ListSubheader, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import useDoFStore from '../../../../store'
import sensorList from '../../../../utilities/sensorList'

/**
 * Exposes type annotations to an Object.keys array
 */
function objectKeysArray<T extends Record<string | number, unknown>>(
    record: T
): ((keyof T & string) | `${keyof T & number}`)[] {
    return Object.keys(record)
}

const allSensorKeys = objectKeysArray(sensorList)
const commonSensorKeys: SensorKey[] = []

objectKeysArray(sensorList).forEach((sensorKey) => {
    const sensor = sensorList[sensorKey]

    if ('isCommon' in sensor && sensor.isCommon) {
        commonSensorKeys.push(sensorKey)
    }
})

function isSensorKey(str: string): str is SensorKey {
    return Boolean(str in sensorList)
}

export default function Sensor({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const onChange = (event: SelectChangeEvent<SensorKey>) => {
        if (isSensorKey(event.target.value)) {
            updateLens({ ...lens, sensorKey: event.target.value })
        }
    }

    return (
        <FormControl fullWidth>
            <Select value={lens.sensorKey} onChange={onChange} size="small" data-testid={`sensor-${lens.id}`}>
                <ListSubheader>Common sizes</ListSubheader>
                {commonSensorKeys.map((key) => {
                    const { name } = sensorList[key]

                    return (
                        <MenuItem value={key} key={key}>
                            {name}
                        </MenuItem>
                    )
                })}
                <ListSubheader>Specific cameras and mounts</ListSubheader>
                {allSensorKeys.map((key) => {
                    const { name } = sensorList[key]

                    return (
                        <MenuItem value={key} key={key}>
                            {name}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}
