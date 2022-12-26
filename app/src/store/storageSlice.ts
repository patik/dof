import { pick } from 'lodash'
import { StateCreator } from 'zustand'
import { LensDataState } from './lensSlice'
import { TableState } from './tableSlice'

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
        const { setUnits, setSorting, setDistance, addLens } = get()

        setUnits(units)
        setSorting(orderBy, order)
        setDistance(distance)

        lenses.forEach((lens) => addLens(lens, true))
    },
})
