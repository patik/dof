import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import { LocalStorageData } from '../store/storageSlice'
import storage from './storage'

export function useReadFromStorage() {
    const [hasStartedReading, setHasStartedReading] = useState(false)
    const [hasFinishedReading, setHasFinishedReading] = useState(false)
    const { lenses, addLens, applyFromLocalStorage } = useDoFStore()
    const [hasFoundNoLensesInStorage, setHasFoundNoLensesInStorage] = useState(false)

    // Read from localStorage
    useEffect(() => {
        if (hasStartedReading || typeof window === 'undefined') {
            return
        }

        async function fetchData() {
            // Don't try to read more than once
            setHasStartedReading(true)

            const stored = await storage.getItem()
            console.log('reading from storage...')
            const stateFromLocalStorage: LocalStorageData | null = stored ? JSON.parse(stored)?.state : null
            console.log('storage value: ', stateFromLocalStorage)

            if (!stateFromLocalStorage) {
                console.log('nothing to read from store')
                setHasFoundNoLensesInStorage(true)
                // Let the other useEffect (for placeholders) know we're done reading
                setHasFinishedReading(true)

                return
            }

            console.log('pulled from localStorage: ', stateFromLocalStorage.state)
            applyFromLocalStorage(stateFromLocalStorage)
            setHasFoundNoLensesInStorage(stateFromLocalStorage.state.lenses.length === 0)

            // Let the write-hook know that we're applying the stored values to state
            setHasFinishedReading(true)
        }

        fetchData()
    }, [applyFromLocalStorage, hasStartedReading])

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
            console.log('no need to create placeholder lenses', {
                length: lenses.length,
                hasRead: hasFinishedReading,
                hasFoundNoLensesInStorage,
            })
            return
        }
        console.log('creating placeholder lenses', { length: lenses.length, hasRead: hasFinishedReading })

        // Populate an empty table with some data
        addLens({
            focalLength: 35,
            aperture: 'f/2',
            sensorKey: 'full',
        })

        // This useEffect will run twice on dev, creating four lenses, so shortcircuit it to prevent tht
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
