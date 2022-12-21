import { InputAdornment, TextField } from '@mui/material'
import { ChangeEvent, ChangeEventHandler } from 'react'
import useLensStore from '../store'

export default function Distance() {
    const { units, distance, setDistance } = useLensStore()

    const handleDistanceChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
        if (parseFloat(event.target.value)) {
            setDistance(parseFloat(event.target.value))
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
