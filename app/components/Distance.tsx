import { InputAdornment, TextField } from '@mui/material'
import { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction } from 'react'

export default function Distance({
    units,
    distance,
    setDistance,
}: {
    units: Units
    distance: number
    setDistance: Dispatch<SetStateAction<number>>
}) {
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
