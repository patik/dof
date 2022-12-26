import { TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import useDoFStore from '../../../../store'

export default function Name({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateLens({ ...lens, name: event.target.value })
    }

    return (
        <TextField
            label="Name"
            onChange={onChange}
            value={lens.name}
            autoComplete="off"
            size="small"
            data-testid={`lens-name-${lens.id}`}
        />
    )
}
