import { FormControl, MenuItem, Select, SelectChangeEvent, TableCell } from '@mui/material'
import { apertureMap } from 'dof'
import { Dispatch, SetStateAction } from 'react'

export default function ApertureCell({
    aperture,
    setAperture,
}: {
    aperture: string
    setAperture: Dispatch<SetStateAction<string>>
}) {
    const onChange = (event: SelectChangeEvent<string>) => {
        console.log('on aperture change ', event, event.target.value)
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
