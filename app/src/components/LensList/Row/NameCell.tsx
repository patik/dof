import { TableCell, TextField } from '@mui/material'
import { ChangeEvent, ChangeEventHandler } from 'react'

export default function NameCell({
    name,
    setName,
    labelId,
}: {
    name: LensDefinition['name']
    setName: (f: LensDefinition['name']) => void
    labelId: string
}) {
    const onChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    return (
        <TableCell component="th" id={labelId} scope="row" padding="none">
            <TextField label="Name" onChange={onChange} value={name} autoComplete="off" />
        </TableCell>
    )
}
