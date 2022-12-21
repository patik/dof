import { TableCell, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useStore from '../../../store/store'

export default function NameCell({ id, labelId }: { id: LensDefinition['id']; labelId: string }) {
    const { lenses, updateLens } = useStore()
    const lens = lenses.find((l) => l.id === id)

    if (!lens) {
        return null
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateLens({ ...lens, name: event.target.value })
    }

    return (
        <TableCell component="th" id={labelId} scope="row" padding="none">
            <TextField label="Name" onChange={onChange} value={lens.name} autoComplete="off" />
        </TableCell>
    )
}
