import { InputAdornment, Switch, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Box } from '@mui/system'
import { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction, useState } from 'react'

function UnitsToggleButton({
    units,
    onChange,
}: {
    units: Units
    onChange: (_event: React.MouseEvent<HTMLElement>, newAlignment: Units | null) => void
}) {
    return (
        <ToggleButtonGroup exclusive color="primary" value={units} onChange={onChange} aria-label="Units">
            <ToggleButton value="metric">Metric (meters)</ToggleButton>
            <ToggleButton value="imperial">Imperial (feet)</ToggleButton>
        </ToggleButtonGroup>
    )
}

export default function Distance({
    units,
    setUnits,
    distance,
    setDistance,
}: {
    units: Units
    setUnits: Dispatch<SetStateAction<Units>>
    distance: number
    setDistance: Dispatch<SetStateAction<number>>
}) {
    const handleUnitsChange = (_event: React.MouseEvent<HTMLElement>, newUnits: Units | null) => {
        if (newUnits !== null) {
            setUnits(newUnits)
        }
    }

    const handleDistanceChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
        if (parseFloat(event.target.value)) {
            setDistance(parseFloat(event.target.value))
        }
    }

    return (
        <>
            <Box p={2}>
                <TextField
                    label="Distance"
                    onChange={handleDistanceChange}
                    value={distance}
                    autoFocus
                    type="number"
                    InputProps={{
                        type: 'number',
                        endAdornment: (
                            <InputAdornment position="end">{`${units === 'metric' ? 'm' : 'ft'}`}</InputAdornment>
                        ),
                    }}
                    autoComplete="off"
                />
            </Box>
            <Box p={2}>
                <UnitsToggleButton units={units} onChange={handleUnitsChange} />
            </Box>
        </>
    )
}
