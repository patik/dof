import { FormControl, MenuItem, Select, SelectChangeEvent, TableCell } from '@mui/material'
import { apertureMap } from 'dof'
import useLensStore from '../../../store'

export default function ApertureCell({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useLensStore()
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
