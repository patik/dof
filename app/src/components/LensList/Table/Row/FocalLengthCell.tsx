import { InputAdornment, TableCell, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useDoFStore from '../../../../store'

export default function FocalLengthCell({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateLens({ ...lens, focalLength: parseFloat(event.target.value) })
    }

    return (
        <TableCell align="right">
            <TextField
                label="Focal length"
                onChange={onChange}
                value={lens.focalLength}
                type="number"
                InputProps={{
                    type: 'number',
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                }}
                autoComplete="off"
                size="small"
            />
        </TableCell>
    )
}
