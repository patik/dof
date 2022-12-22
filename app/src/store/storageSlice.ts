import { StateCreator } from 'zustand'
import { LensDataState } from './lensSlice'
import { TableState } from './tableSlice'
import { pick } from 'lodash'

export type LocalStorageData = {
    state: Pick<TableState & LensDataState, 'lenses' | 'units' | 'distance' | 'order' | 'orderBy'>
    version: number
}

export interface StorageState {
    extractForLocalStorage: () => LocalStorageData
    applyFromLocalStorage: (partialState: LocalStorageData) => void
}

export const createStorageSlice: StateCreator<TableState & LensDataState & StorageState, [], [], StorageState> = (
    _set,
    get
) => ({
    extractForLocalStorage() {
        return {
            state: pick(get(), ['lenses', 'units', 'distance', 'order', 'orderBy']),
            version: 1,
        }
    },
    applyFromLocalStorage(partialState: LocalStorageData) {
        const { distance, lenses, order, orderBy, units } = partialState.state

        console.log('[applyFromLocalStorage] A ', { distance, lenses, order, orderBy, units })
        get().setUnits(units)
        get().setSorting(orderBy, order)
        get().setDistance(distance)

        lenses.forEach(get().addLens)
    },
})
