import type { StateCreator } from 'zustand'

export const createStorageSlice: StateCreator<TableState & LensDataState & StorageState, [], [], StorageState> = (
    _set,
    get,
) => ({
    extractForLocalStorage() {
        const { lenses, units, distance, order, orderBy } = get()

        return {
            state: { lenses, units, distance, order, orderBy },
            version: 1,
        }
    },
    applyFromLocalStorage(partialState: LocalStorageData) {
        const { distance, lenses, order, orderBy, units } = partialState.state
        const { setUnits, setSorting, setDistance, addLens } = get()

        setUnits(units)
        setSorting(orderBy, order)
        setDistance(distance)

        lenses.forEach((lens) => {
            addLens(lens, true)
        })
    },
})
