import { Box, Typography } from '@mui/material'
import Distance from './Distance'
import UnitsToggle from './UnitsToggle'

export function TopToolbar() {
    return (
        <Box display="flex">
            <Box flexGrow={1}>
                <Typography variant="h2">Lenses</Typography>
            </Box>
            <Box mr={1}>
                <Distance />
            </Box>
            <UnitsToggle />
        </Box>
    )
}
