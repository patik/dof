import { StateCreator } from 'zustand'
import { LensDataState } from './lensSlice'
import { TableState } from './tableSlice'
import { pick } from 'lodash'

export type LocalStorageData = {
    state: Pick<TableState & LensDataState, 'lenses' | 'selected' | 'units' | 'distance' | 'order' | 'orderBy'>
    version: number
}

export interface StorageState {
    extractForLocalStorage: () => LocalStorageData
    applyFromLocalStorage: (partialState: LocalStorageData) => void
}

export const createStorageSlice: StateCreator<TableState & LensDataState & StorageState, [], [], StorageState> = (
    set,
    get
) => ({
    extractForLocalStorage() {
        return {
            state: pick(get(), ['lenses', 'selected', 'units', 'distance', 'order', 'orderBy']),
            version: 1,
        }
    },
    applyFromLocalStorage(partialState: LocalStorageData) {
        const { selected, distance, lenses, orderBy, units } = partialState.state

        get().setSelected(selected)
        get().setUnits(units)
        get().setSorting(orderBy)
        get().setDistance(distance)

        lenses.forEach(get().addLens)
    },
})
