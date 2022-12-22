import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import { LocalStorageData } from '../store/storageSlice'
import storage from './storage'

/**
 * Reads the state from local storage
 */
export function useReadFromStorage() {
    const [hasStartedReading, setHasStartedReading] = useState(false)
    const [hasFinishedReading, setHasFinishedReading] = useState(false)
    const { lenses, addLens, applyFromLocalStorage } = useDoFStore()
    const [hasFoundNoLensesInStorage, setHasFoundNoLensesInStorage] = useState(false)

    // Read from localStorage
    // Note that on Next.js dev server this hook will run twice, causing duplicate lenses to be added to state
    useEffect(() => {
        if (hasStartedReading || hasFinishedReading || typeof window === 'undefined') {
            return
        }

        async function fetchData() {
            // Don't try to read more than once
            setHasStartedReading(true)

            const stored = await storage.getItem()

            const stateFromLocalStorage: LocalStorageData | null = stored ? JSON.parse(stored)?.state : null

            if (!stateFromLocalStorage) {
                setHasFoundNoLensesInStorage(true)

                // Let the other `useEffect` below (the one for placeholders) know we're done reading
                setHasFinishedReading(true)

                return
            }

            applyFromLocalStorage(stateFromLocalStorage)
            setHasFoundNoLensesInStorage(stateFromLocalStorage.state.lenses.length === 0)

            // Let the write-hook know that we're applying the stored values to state
            setHasFinishedReading(true)
        }

        fetchData()
    }, [applyFromLocalStorage, hasFinishedReading, hasStartedReading])

    // Fallback to inserting placeholder examples if nothing was found in storage
    useEffect(() => {
        // Do nothing if...
        if (
            // the table has data already
            lenses.length > 0 ||
            // or, lenses were found in localStorage
            !hasFoundNoLensesInStorage ||
            // or, if we haven't read from storage yet (which means we don't know if the table will eventually have data or not)
            !hasFinishedReading
        ) {
            return
        }

        // Populate an empty table with some data
        addLens({
            focalLength: 35,
            aperture: 'f/2',
            sensorKey: 'full',
        })

        // This useEffect will run twice on dev, which creates four lenses in total, so we shortcircuit it here to prevent that
        if (process.env.NODE_ENV === 'development') {
            return
        }

        addLens({
            focalLength: 55,
            aperture: 'f/1.4',
            sensorKey: 'mft',
        })
    }, [addLens, hasFoundNoLensesInStorage, hasFinishedReading, lenses.length])

    return hasFinishedReading
}
