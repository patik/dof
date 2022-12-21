import { FormControl, MenuItem, Select, SelectChangeEvent, TableCell } from '@mui/material'
import useStore from '../../../store/store'
import { fullList } from '../../sensorList'

/**
 * Exposes type annotations to an Object.keys array
 */
function objectKeysArray<T extends Record<string | number, unknown>>(
    record: T
): ((keyof T & string) | `${keyof T & number}`)[] {
    return Object.keys(record)
}

function isSensorKey(str: string): str is SensorKey {
    return Boolean(str in fullList)
}

export default function SensorCell({ id }: { id: LensDefinition['id'] }) {
    const { lenses, updateLens } = useStore()
    const lens = lenses.find((l) => l.id === id)

    if (!lens) {
        return null
    }

    const onChange = (event: SelectChangeEvent<SensorKey>) => {
        if (isSensorKey(event.target.value)) {
            updateLens({ ...lens, sensorKey: event.target.value })
        }
    }

    return (
        <TableCell align="right">
            <FormControl fullWidth>
                <Select value={lens.sensorKey} onChange={onChange}>
                    {objectKeysArray(fullList).map((key) => {
                        const { name } = fullList[key]

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
