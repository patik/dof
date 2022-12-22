import { del, get, set } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.

const STORAGE_KEY = 'dof-storage'

// Custom storage object
const storage = {
    getItem: async (): Promise<string | null> => {
        console.log(STORAGE_KEY, 'has been retrieved')
        return (await get(STORAGE_KEY)) || null
    },
    setItem: async (value: string): Promise<void> => {
        console.log(STORAGE_KEY, 'with value', value, 'has been saved')
        await set(STORAGE_KEY, value)
    },
    removeItem: async (): Promise<void> => {
        console.log(STORAGE_KEY, 'has been deleted')
        await del(STORAGE_KEY)
    },
}

export default storage
