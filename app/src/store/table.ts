import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface TableState {
    order: Order
    orderBy: ColumnName
    selected: readonly SelectedItem[]
    setSorting: (col: ColumnName) => void
    setSelected: (newSelected: readonly SelectedItem[]) => void
    isSelected: (id: LensDefinition['id']) => boolean
    getRowLabelId: (lens: LensDefinition) => string
}

const useTableStore = create<TableState>()(
    devtools(
        persist(
            (set, get) => ({
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
            }),
            {
                name: 'dof-table-storage',
            }
        )
    )
)

export default useTableStore
