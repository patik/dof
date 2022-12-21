import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createLensDataSlice, LensDataState } from './lensData'
import { createTableSlice, TableState } from './table'

const useLensStore = create<TableState & LensDataState>()(
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

export default useLensStore
