import { Box } from '@mui/material'
import { useReadFromStorage } from '../utilities/useReadFromStorage'
import { useWriteToStorage } from '../utilities/useWriteToFromStorage'
import { Graph } from './Graph/Graph'
import LensTable from './LensList/Table/LensTable'
import { TopToolbar } from './LensList/TopToolbar'

export default function Main() {
    const hasReadFromStorage = useReadFromStorage()

    useWriteToStorage(hasReadFromStorage)

    return (
        <Box p={2}>
            <Box mb={2}>
                <TopToolbar />
            </Box>

            <Box mb={2}>
                <LensTable />
            </Box>

            <Box mb={2} height={400} width="100%">
                <Graph />
            </Box>
        </Box>
    )
}
