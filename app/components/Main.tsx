import { Box } from '@mui/material'
import { useState } from 'react'
import Distance from './Distance'
import LensList from './LensList'

export default function Main() {
    const [units, setUnits] = useState<Units>('metric')
    const [distance, setDistance] = useState<number>(5)

    return (
        <Box>
            <Distance units={units} setUnits={setUnits} distance={distance} setDistance={setDistance} />
            <LensList units={units} distance={distance} />
        </Box>
    )
}
