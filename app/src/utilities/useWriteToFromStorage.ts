import { cloneDeep } from 'lodash'
import { useEffect } from 'react'
import useDoFStore from '../store'
import storage from './storage'

export function useWriteToStorage(hasReadFromStorage: boolean) {
    // const [hasWritten, setHasWritten] = useState(false)
    const { extractForLocalStorage } = useDoFStore()
    const state = extractForLocalStorage()

    useEffect(() => {
        if (!hasReadFromStorage /* || hasWritten */ || typeof window === 'undefined') {
            console.log('skipping writing to storage ', { hasReadFromStorage })
            return
        }

        async function fetchData() {
            // Don't read more than once
            // setHasWritten(true)
            console.log('writing to storage ', cloneDeep(state))
            await storage.setItem(
                JSON.stringify({
                    state,
                    version: 0,
                })
            )
        }

        fetchData()
    }, [hasReadFromStorage, state])
}
