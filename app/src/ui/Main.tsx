import { Box } from '@mui/material'
import useReadFromHash from '../utilities/useReadFromHash'
import { useReadFromStorage } from '../utilities/useReadFromStorage'
import useWriteToHash from '../utilities/useWriteToHash'
import { useWriteToStorage } from '../utilities/useWriteToStorage'
import Graph from './Graph/Graph'
import LensTable from './LensList/Table/LensTable'
import TopToolbar from './LensList/TopToolbar/TopToolbar'

export default function Main() {
    const hasReadFromHash = useReadFromHash()
    const hasReadFromStorage = useReadFromStorage()

    useWriteToStorage(hasReadFromStorage)
    useWriteToHash(hasReadFromHash)

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
