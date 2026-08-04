import { Box } from '@mui/material'
import { lazy, Suspense } from 'react'
import { useAddPlaceholderLenses } from '../utilities/useAddPlaceholderLenses'
import useReadFromHash from '../utilities/useReadFromHash'
import { useReadFromStorage } from '../utilities/useReadFromStorage'
import useWriteToHash from '../utilities/useWriteToHash'
import { useWriteToStorage } from '../utilities/useWriteToStorage'
import LensTable from './LensTable/Table/LensTable'
import TopToolbar from './LensTable/TopToolbar/TopToolbar'

const Graph = lazy(() => import('./Graph/Graph'))

export default function Main() {
    const hasReadFromHash = useReadFromHash()
    const hasReadFromStorage = useReadFromStorage()

    useWriteToStorage(hasReadFromStorage)
    useWriteToHash(hasReadFromHash)
    const hasInitializedLenses = useAddPlaceholderLenses(hasReadFromHash, hasReadFromStorage)

    if (!hasInitializedLenses) {
        return <Box minHeight={{ xs: '42rem', sm: '36rem' }} aria-hidden="true" />
    }

    return (
        <>
            <Box my={3}>
                <TopToolbar />
            </Box>

            <Box mb={2}>
                <LensTable />
            </Box>

            <Box mb={2} height={400} width="100%">
                <Suspense fallback={null}>
                    <Graph />
                </Suspense>
            </Box>
        </>
    )
}
