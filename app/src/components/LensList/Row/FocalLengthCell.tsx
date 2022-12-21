import { InputAdornment, TableCell, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useStore from '../../../store/store'

export default function FocalLengthCell({ id }: { id: LensDefinition['id'] }) {
    const { lenses, updateLens } = useStore()
    const lens = lenses.find((l) => l.id === id)

    if (!lens) {
        return
    }

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
