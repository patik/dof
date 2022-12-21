import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createLensDataSlice, LensDataState } from './lensSlice'
import { createTableSlice, TableState } from './tableSlice'

const useDoFStore = create<TableState & LensDataState>()(
    devtools(
        persist(
            (...a) => ({
                ...createTableSlice(...a),
                ...createLensDataSlice(...a),
            }),
            {
                name: 'dof-storage',
            }
        )
    )
)

export default useDoFStore
