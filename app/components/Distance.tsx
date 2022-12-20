import { InputAdornment, TextField } from '@mui/material'
import { ChangeEvent, ChangeEventHandler } from 'react'

export default function Distance({
    units,
    distance,
    onDistanceChange,
}: {
    units: Units
    distance: Distance
    onDistanceChange: (newValue: Distance) => void
}) {
    const handleDistanceChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
        if (parseFloat(event.target.value)) {
            onDistanceChange(parseFloat(event.target.value))
        }
    }

    return (
        <TextField
            label="Distance"
            onChange={handleDistanceChange}
            value={distance}
            type="number"
            InputProps={{
                type: 'number',
                endAdornment: <InputAdornment position="end">{`${units === 'metric' ? 'm' : 'ft'}`}</InputAdornment>,
            }}
            autoComplete="off"
        />
    )
}
