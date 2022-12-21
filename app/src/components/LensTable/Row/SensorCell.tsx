import { FormControl, MenuItem, Select, SelectChangeEvent, TableCell } from '@mui/material'
import useDoFStore from '../../../store'
import sensorList from '../../../utilities/sensorList'

/**
 * Exposes type annotations to an Object.keys array
 */
function objectKeysArray<T extends Record<string | number, unknown>>(
    record: T
): ((keyof T & string) | `${keyof T & number}`)[] {
    return Object.keys(record)
}

function isSensorKey(str: string): str is SensorKey {
    return Boolean(str in sensorList)
}

export default function SensorCell({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const onChange = (event: SelectChangeEvent<SensorKey>) => {
        if (isSensorKey(event.target.value)) {
            updateLens({ ...lens, sensorKey: event.target.value })
        }
    }

    return (
        <TableCell align="right">
            <FormControl fullWidth>
                <Select value={lens.sensorKey} onChange={onChange} size="small">
                    {objectKeysArray(sensorList).map((key) => {
                        const { name } = sensorList[key]

                        return (
                            <MenuItem value={key} key={key}>
                                {name}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </TableCell>
    )
}
