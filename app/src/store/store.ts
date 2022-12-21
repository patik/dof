import { Lens } from 'dof'
import { compact } from 'lodash'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { fullList } from '../components/sensorList'
import { rounded } from '../utilities/conversion'
import { IDGenerator } from '../utilities/IDGenerator'

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
        cropFactor: fullList[sensorKey].value,
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

const initialUnits: Units = 'metric'
const initialDistance: Distance = 5
const initialLensState = [
    createLensDefinition({
        id: idGenerator.getNext(),
        name: 'Lens 1',
        focalLength: 35,
        aperture: 'f/2',
        sensorKey: 'full',
        distance: initialDistance,
        units: initialUnits,
    }),
    createLensDefinition({
        id: idGenerator.getNext(),
        name: 'Lens 2',
        focalLength: 55,
        aperture: 'f/1.4',
        sensorKey: 'mft',
        distance: initialDistance,
        units: initialUnits,
    }),
]

interface State {
    units: Units
    distance: Distance
    lenses: LensDefinition[]
    actions: {
        addLens: () => void
        updateLens: (lens: LensDefinition) => void
        deleteLenses: (lensesToDelete: readonly SelectedItem[]) => void
        duplicateLenses: (lensesToDuplicate: readonly SelectedItem[]) => void
        setDistance: (newValue: Distance) => void
        setUnits: (newValue: Units) => void
    }
}

const useStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                units: initialUnits,
                distance: initialDistance,
                lenses: initialLensState,
                actions: {
                    addLens() {
                        set((state) => ({
                            ...state,
                            lenses: [
                                ...state.lenses,
                                createLensDefinition({
                                    id: idGenerator.getNext(),
                                    name: `Lens ${state.lenses.length + 1}`,
                                    focalLength: 35,
                                    aperture: 'f/2',
                                    sensorKey: 'full',
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
                },
            }),
            {
                name: 'dof-storage',
            }
        )
    )
)

export default useStore
