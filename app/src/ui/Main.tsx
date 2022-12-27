import { Box } from '@mui/material'
import useReadFromHash from '../utilities/useReadFromHash'
import { useReadFromStorage } from '../utilities/useReadFromStorage'
import useWriteToHash from '../utilities/useWriteToHash'
import { useWriteToStorage } from '../utilities/useWriteToStorage'
import Graph from './Graph/Graph'
import LensTable from './LensTable/Table/LensTable'
import TopToolbar from './LensTable/TopToolbar/TopToolbar'

export default function Main() {
    const hasReadFromHash = useReadFromHash()
    const hasReadFromStorage = useReadFromStorage()

    useWriteToStorage(hasReadFromStorage)
    useWriteToHash(hasReadFromHash)

    return (
        <Box>
            <Box my={3}>
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
