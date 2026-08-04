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
        return <div className="min-h-[42rem] min-[600px]:min-h-[36rem]" aria-hidden="true" />
    }

    return (
        <>
            <div className="my-6">
                <TopToolbar />
            </div>

            <div className="mb-4">
                <LensTable />
            </div>

            <div className="mb-4 w-full">
                <Suspense fallback={null}>
                    <Graph />
                </Suspense>
            </div>
        </>
    )
}
