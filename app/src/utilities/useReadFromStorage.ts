import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import { LocalStorageData } from '../store/storageSlice'
import storage from './storage'

export function useReadFromStorage() {
    const [hasRead, setHasRead] = useState(false)
    const { applyFromLocalStorage } = useDoFStore()

    useEffect(() => {
        if (hasRead || typeof window === 'undefined') {
            return
        }

        async function fetchData() {
            const stored = await storage.getItem()

            console.log('stored value: ', stored)
            const pulledFromLocalStorage: LocalStorageData | null = stored ? JSON.parse(stored) : null

            if (!pulledFromLocalStorage) {
                console.log('nothing to read from store')
                return
            }

            console.log('pulled from localStorage: ', pulledFromLocalStorage)

            applyFromLocalStorage(pulledFromLocalStorage)

            // Don't read more than once
            setHasRead(true)
        }

        fetchData()
    }, [applyFromLocalStorage, hasRead])
}
