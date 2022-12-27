import { Box, Typography } from '@mui/material'
import useIsMobile from '../../../utilities/useIsMobile'
import Distance from './Distance'
import UnitsToggle from './UnitsToggle'

export const SPACE_BETWEEN_FIELDS = '8px' // Theme spacing

export default function TopToolbar() {
    const isMobile = useIsMobile()

    return (
        <Box display="flex" sx={isMobile ? { flexWrap: 'wrap' } : null}>
            <Box flexGrow={1} sx={isMobile ? { minWidth: '100%', pb: 2 } : null}>
                <Typography variant="h2">Lenses</Typography>
            </Box>
            <Box mr={SPACE_BETWEEN_FIELDS} sx={isMobile ? { width: '50%' } : null}>
                <Distance />
            </Box>
            <UnitsToggle />
        </Box>
    )
}
