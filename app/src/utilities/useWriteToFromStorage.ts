import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import storage from './storage'

export function useWriteToFromStorage() {
    const [hasWritten, setHasWritten] = useState(false)
    const { extractForLocalStorage } = useDoFStore()
    const state = extractForLocalStorage()

    useEffect(() => {
        if (hasWritten || typeof window === 'undefined') {
            return
        }

        async function fetchData() {
            console.log('writing to storage ', cloneDeep(state))
            await storage.setItem(
                JSON.stringify({
                    state,
                    version: 0,
                })
            )

            // Don't read more than once
            setHasWritten(true)
        }

        fetchData()
    }, [hasWritten, state])
}
