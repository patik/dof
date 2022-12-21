import { FormControl, MenuItem, Select, SelectChangeEvent, TableCell } from '@mui/material'
import { apertureMap } from 'dof'
import useStore from '../../../store/store'

export default function ApertureCell({ id }: { id: LensDefinition['id'] }) {
    const { lenses, updateLens } = useStore()
    const lens = lenses.find((l) => l.id === id)

    if (!lens) {
        return null
    }

    const onChange = (event: SelectChangeEvent<string>) => {
        updateLens({ ...lens, aperture: event.target.value })
    }

    return (
        <TableCell align="right">
            <FormControl fullWidth>
                <Select value={lens.aperture} onChange={onChange}>
                    {Object.keys(apertureMap).map((key) => (
                        <MenuItem value={key} key={key}>
                            {key}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </TableCell>
    )
}
