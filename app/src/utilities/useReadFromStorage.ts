import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import { LensDataState } from '../store/lensSlice'
import { LocalStorageData } from '../store/storageSlice'
import storage from './storage'

function addPlaceholderLenses(addLens: LensDataState['addLens']) {
    // Populate the empty table with some data
    addLens(
        {
            name: 'Lens 1',
            focalLength: 35,
            aperture: 'f/2',
            sensorKey: 'full',
        },
        true
    )

    addLens(
        {
            name: 'Lens 2',
            focalLength: 55,
            aperture: 'f/1.4',
            sensorKey: 'mft',
        },
        true
    )
}

/**
 * Reads the state from local storage
 */
export function useReadFromStorage() {
    const [hasStartedReading, setHasStartedReading] = useState(false)
    const [hasFinishedReading, setHasFinishedReading] = useState(false)
    const { addLens, applyFromLocalStorage } = useDoFStore()

    // Read from localStorage
    // Note that on Next.js dev server this hook will run twice, causing duplicate lenses to be added to state
    useEffect(() => {
        if (hasStartedReading || hasFinishedReading || typeof window === 'undefined') {
            return
        }

        // Don't try to read more than once
        setHasStartedReading(true)

        async function fetchData() {
            const stored = await storage.getItem()
            const stateFromLocalStorage: LocalStorageData | null = stored ? JSON.parse(stored)?.state : null

            if (!stateFromLocalStorage) {
                setHasFinishedReading(true)
                addPlaceholderLenses(addLens)

                return
            }

            applyFromLocalStorage(stateFromLocalStorage)

            if (stateFromLocalStorage.state.lenses.length === 0) {
                addPlaceholderLenses(addLens)
            }

            setHasFinishedReading(true)
        }

        fetchData()
    }, [addLens, applyFromLocalStorage, hasFinishedReading, hasStartedReading])

    return hasFinishedReading
}
