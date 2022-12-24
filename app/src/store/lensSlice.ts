import { Lens } from 'dof'
import { compact, defaults } from 'lodash'
import { StateCreator } from 'zustand'
import { rounded } from '../utilities/conversion'
import IDGenerator from '../utilities/IDGenerator'
import sensorList from '../utilities/sensorList'
import { StorageState } from './storageSlice'
import { TableState } from './tableSlice'

const idGenerator = new IDGenerator()

function createLensDefinition({
    id,
    name,
    focalLength,
    aperture,
    sensorKey,
    distance,
    units,
}: {
    id: string
    name: string
    focalLength: number
    aperture: string
    sensorKey: SensorKey
    distance: number
    units: Units
}): LensDefinition {
    const { dof } = new Lens({
        focalLength,
        aperture,
        cropFactor: sensorList[sensorKey].value,
        id,
    }).dof(distance, units === 'imperial')

    return {
        id,
        name,
        aperture,
        focalLength,
        sensorKey,
        depthOfField: rounded(dof),
    }
}

type DefaultLensData = Pick<LensDefinition, 'name' | 'focalLength' | 'aperture' | 'sensorKey'>

export interface LensDataState {
    units: Units
    distance: Distance
    lenses: LensDefinition[]
    addLens: (opts?: Partial<DefaultLensData>) => void
    updateLens: (lens: LensDefinition) => void
    deleteLenses: (lensesToDelete: readonly SelectedItem[]) => void
    duplicateLenses: (lensesToDuplicate: readonly SelectedItem[]) => void
    setDistance: (newValue: Distance) => void
    setUnits: (newValue: Units) => void
}

const defaultLensData: (numLenses: number) => DefaultLensData = (numLenses = 0) => ({
    name: `Lens ${numLenses + 1}`,
    focalLength: 35,
    aperture: 'f/2',
    sensorKey: 'full',
})

export const createLensDataSlice: StateCreator<TableState & LensDataState & StorageState, [], [], LensDataState> = (
    set,
    get
) => {
    return {
        units: 'metric',
        distance: 5,
        lenses: [],
        addLens(options) {
            const settings = defaults({}, options, defaultLensData(get().lenses.length))

            set((state) => ({
                ...state,
                lenses: [
                    ...state.lenses,
                    createLensDefinition({
                        ...settings,
                        id: idGenerator.getNext(),
                        distance: state.distance,
                        units: state.units,
                    }),
                ],
            }))
        },
        updateLens(lens: LensDefinition) {
            set((state) => {
                const lensIndex = state.lenses.findIndex((r) => r.id === lens.id)
                const newLenses = [...state.lenses]

                newLenses[lensIndex] = createLensDefinition({
                    ...lens,
                    distance: state.distance,
                    units: state.units,
                })

                return {
                    ...state,
                    lenses: newLenses,
                }
            })
        },
        deleteLenses(lensesToDelete: readonly SelectedItem[]) {
            set((state) => {
                if (lensesToDelete.length === 0) {
                    return state
                }

                const remainingRows: LensDefinition[] = [...state.lenses].filter(
                    (row) => !lensesToDelete.includes(row.id)
                )

                return {
                    ...state,
                    lenses: remainingRows,
                    // Clear table row selection (i.e. to reset the Select All box, and to hide the toolbar)
                    selected: [],
                }
            })
        },
        duplicateLenses(lensesToDuplicate: readonly SelectedItem[]) {
            set((state) => {
                const newLenses: LensDefinition[] = compact(
                    lensesToDuplicate.map((id) => {
                        const existingRow = state.lenses.find((row) => row.id === id)

                        if (!existingRow) {
                            console.error('Could not find row to be duplicated ', id)
                            return undefined
                        }

                        return createLensDefinition({
                            ...existingRow,
                            id: idGenerator.getNext(),
                            name: `${existingRow.name} copy`,
                            distance: state.distance,
                            units: state.units,
                        })
                    })
                )

                if (newLenses.length === 0) {
                    return state
                }

                return {
                    ...state,
                    lenses: [...state.lenses, ...newLenses],
                }
            })
        },
        setDistance(newValue: Distance) {
            set((state) => ({
                ...state,
                distance: newValue,

                // Update all stored lenses by recalculating their depths of field
                lenses: state.lenses.map((lens) =>
                    createLensDefinition({
                        ...lens,
                        distance: newValue,
                        units: state.units,
                    })
                ),
            }))
        },
        setUnits(newValue: Units) {
            set((state) => ({
                ...state,
                units: newValue,
                // Update all stored lenses by recalculating their depths of field

                lenses: state.lenses.map((lens) =>
                    createLensDefinition({
                        ...lens,
                        distance: state.distance,
                        units: newValue,
                    })
                ),
            }))
        },
    }
}
