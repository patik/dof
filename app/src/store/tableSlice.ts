import { StateCreator } from 'zustand'
import { LensDataState } from './lensSlice'

export interface TableState {
    order: Order
    orderBy: ColumnName
    selected: readonly SelectedItem[]
    setSorting: (col: ColumnName) => void
    setSelected: (newSelected: readonly SelectedItem[]) => void
    isSelected: (id: LensDefinition['id']) => boolean
    getRowLabelId: (lens: LensDefinition) => string
}

export const createTableSlice: StateCreator<TableState & LensDataState, [], [], TableState> = (set, get) => ({
    order: 'asc',
    orderBy: 'id',
    selected: [],
    setSorting(col: ColumnName) {
        set((state) => {
            const isAsc = state.orderBy === col && state.order === 'asc'

            return {
                ...state,
                order: isAsc ? 'desc' : 'asc',
                orderBy: col,
            }
        })
    },
    setSelected(newSelected: readonly SelectedItem[]) {
        set((state) => {
            return {
                ...state,
                selected: newSelected,
            }
        })
    },
    isSelected(id: SelectedItem) {
        return get().selected.indexOf(id) !== -1
    },
    getRowLabelId(lens: LensDefinition) {
        return `enhanced-table-checkbox-${lens.name}`
    },
})
