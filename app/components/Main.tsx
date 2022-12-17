import { Box } from '@mui/material'
import { useState } from 'react'
import Distance from './Distance'
import LensList from './LensList/Table'
import UnitsToggle from './UnitsToggle'

export default function Main() {
    const [units, setUnits] = useState<Units>('metric')
    const [distance, setDistance] = useState<number>(5)

    return (
        <Box p={2}>
            <Box mb={2}>
                <Distance units={units} distance={distance} setDistance={setDistance} />
            </Box>

            <Box mb={2}>
                <LensList units={units} distance={distance} />
            </Box>

            <Box mb={2}>
                <UnitsToggle units={units} setUnits={setUnits} />
            </Box>
        </Box>
    )
}
