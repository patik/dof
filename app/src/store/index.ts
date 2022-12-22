import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLensDataSlice, LensDataState } from './lensSlice'
import { createStorageSlice, StorageState } from './storageSlice'
import { createTableSlice, TableState } from './tableSlice'

const useDoFStore = create<TableState & LensDataState & StorageState>()(
    devtools((set, get, state) => ({
        ...createTableSlice(set, get, state),
        ...createLensDataSlice(set, get, state),
        ...createStorageSlice(set, get, state),
    }))
)

export default useDoFStore
