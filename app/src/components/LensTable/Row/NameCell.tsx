import { TableCell, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useDoFStore from '../../../store'

export default function NameCell({ lens }: { lens: LensDefinition }) {
    const { updateLens, getRowLabelId } = useDoFStore()
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateLens({ ...lens, name: event.target.value })
    }

    return (
        <TableCell component="th" id={getRowLabelId(lens)} scope="row" padding="none">
            <TextField label="Name" onChange={onChange} value={lens.name} autoComplete="off" size="small" />
        </TableCell>
    )
}
