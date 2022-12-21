import { TableCell, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useLensDataStore from '../../../store/lensData'
import useTableStore from '../../../store/table'

export default function NameCell({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useLensDataStore()
    const { getRowLabelId } = useTableStore()
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateLens({ ...lens, name: event.target.value })
    }

    return (
        <TableCell component="th" id={getRowLabelId(lens)} scope="row" padding="none">
            <TextField label="Name" onChange={onChange} value={lens.name} autoComplete="off" />
        </TableCell>
    )
}
