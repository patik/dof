import { InputAdornment, TableCell, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useLensDataStore from '../../../store/lensData'

export default function FocalLengthCell({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useLensDataStore()
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
            />
        </TableCell>
    )
}
