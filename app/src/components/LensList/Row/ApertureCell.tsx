import { FormControl, MenuItem, Select, SelectChangeEvent, TableCell } from '@mui/material'
import { apertureMap } from 'dof'

export default function ApertureCell({
    aperture,
    setAperture,
}: {
    aperture: LensDefinition['aperture']
    setAperture: (a: LensDefinition['aperture']) => void
}) {
    const onChange = (event: SelectChangeEvent<string>) => {
        setAperture(event.target.value.trim())
    }

    return (
        <TableCell align="right">
            <FormControl fullWidth>
                <Select value={aperture} onChange={onChange}>
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
