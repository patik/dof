import { useEffect } from 'react'
import useDoFStore from '../store'
import storage from './storage'

/**
 * Writes the state to local storage whenever it changes
 */
export function useWriteToStorage(hasReadFromStorage: boolean) {
    const { extractForLocalStorage } = useDoFStore()
    const state = extractForLocalStorage()

    useEffect(() => {
        if (!hasReadFromStorage || typeof window === 'undefined') {
            return
        }

        async function writeData() {
            await storage.setItem(
                JSON.stringify({
                    state,
                    version: 0,
                })
            )
        }

        writeData()
    }, [hasReadFromStorage, state])
}
