import { InputAdornment, TableCell, TextField } from '@mui/material'
import { ChangeEvent, ChangeEventHandler } from 'react'

export default function FocalLengthCell({
    focalLength,
    setFocalLength,
}: {
    focalLength: LensProperties['focalLength']
    setFocalLength: (f: LensProperties['focalLength']) => void
}) {
    const onChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
        console.log('on focalLength change ', event, event.target.value)
        setFocalLength(parseFloat(event.target.value))
    }

    return (
        <TableCell align="right">
            <TextField
                label="Focal length"
                onChange={onChange}
                value={focalLength}
                type="number"
                InputProps={{
                    type: 'number',
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                }}
                autoComplete="off"
            />
        </TableCell>
    )
}
