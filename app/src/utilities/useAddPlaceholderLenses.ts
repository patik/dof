import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import placeholderLenses from './placeholderLenses'

/**
 * Populate the empty table with some data
 */
function addPlaceholderLenses(addLens: LensDataState['addLens']) {
    placeholderLenses.forEach((lens) => {
        addLens(lens, true)
    })
}

export function useAddPlaceholderLenses(hasReadFromHash: boolean, hasReadFromStorage: boolean) {
    const [hasFinished, setHasFinished] = useState(false)
    const { addLens } = useDoFStore()

    useEffect(() => {
        if (hasFinished || !hasReadFromHash || !hasReadFromStorage || typeof window === 'undefined') {
            return
        }

        // The earlier initialization may or may not have added anything to the state (based on duplicates, validation, etc), so check the count again.
        if (useDoFStore.getState().lenses.length === 0) {
            addPlaceholderLenses(addLens)
        }

        // Mark initialization complete only after the placeholder lenses are in the store.
        setHasFinished(true)
    }, [addLens, hasFinished, hasReadFromHash, hasReadFromStorage])

    return hasFinished
}
