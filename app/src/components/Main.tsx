import { Box } from '@mui/material'
import Distance from './Distance'
import { Graph } from './Graph'
import LensList from './LensList/LensList'
import UnitsToggle from './UnitsToggle'

export default function Main() {
    return (
        <Box p={2}>
            <Box mb={2} textAlign="right">
                <Distance />
            </Box>

            <Box mb={2}>
                <LensList />
            </Box>

            <Box mb={2} textAlign="right">
                <UnitsToggle />
            </Box>

            <Box mb={2} height={400} width="100%">
                <Graph />
            </Box>
        </Box>
    )
}
