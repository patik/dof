import { TableCell, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useLensStore from '../../../store'

export default function NameCell({ lens }: { lens: LensDefinition }) {
    const { updateLens, getRowLabelId } = useLensStore()
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateLens({ ...lens, name: event.target.value })
    }

    return (
        <TableCell component="th" id={getRowLabelId(lens)} scope="row" padding="none">
            <TextField label="Name" onChange={onChange} value={lens.name} autoComplete="off" />
        </TableCell>
    )
}
