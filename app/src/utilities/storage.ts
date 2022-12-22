import { del, get, set } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.

const STORAGE_KEY = 'dof-storage'

// Custom storage object
const storage = {
    getItem: async (): Promise<string | null> => {
        return (await get(STORAGE_KEY)) || null
    },
    setItem: async (value: string): Promise<void> => {
        await set(STORAGE_KEY, value)
    },
    removeItem: async (): Promise<void> => {
        await del(STORAGE_KEY)
    },
}

export default storage
