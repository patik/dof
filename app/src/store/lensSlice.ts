import { Lens } from 'dof'
import { compact, defaults, cloneDeep } from 'lodash'
import { StateCreator } from 'zustand'
import { rounded } from '../utilities/conversion'
import IDGenerator from '../utilities/IDGenerator'
import sensorList from '../utilities/sensorList'
import { StorageState } from './storageSlice'
import { TableState } from './tableSlice'

export const DEFAULT_DISTANCE: Distance = 5

const idGenerator = new IDGenerator()

export function createLensDefinition({
    id,
    name,
    focalLength,
    aperture,
    sensorKey,
    distance,
    units,
}: {
    id?: string
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
        id: id ?? idGenerator.getNext(),
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
    addLens: (opts?: Partial<DefaultLensData>, skipIfDuplicate?: boolean) => void
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
        distance: DEFAULT_DISTANCE,
        lenses: [],
        addLens(config, skipIfDuplicate = false) {
            const { lenses, distance, units } = get()
            const settings = defaults({}, config, defaultLensData(lenses.length))
            const lens = createLensDefinition({
                ...settings,
                id: idGenerator.getNext(),
                distance,
                units,
            })

            if (
                skipIfDuplicate &&
                lenses.find((l) => {
                    if (!(l.name === lens.name && l.depthOfField === lens.depthOfField)) {
                        // console.log('not a duplicate: ', lens.name, lens.depthOfField, l.name, l.depthOfField)
                    }
                    return l.name === lens.name && l.depthOfField === lens.depthOfField
                })
            ) {
                console.log('is a duplicate: ', lens.name, lens.depthOfField)
                return
            } else if (skipIfDuplicate) {
                console.log('not a duplicate: ', lens.name, lens.depthOfField, cloneDeep(lenses))
            }

            set((state) => ({
                ...state,
                lenses: [...lenses, lens],
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

                const remainingLenses: LensDefinition[] = [...state.lenses].filter((lens) => {
                    return !lensesToDelete.includes(lens.id)
                })

                console.log(
                    `Deleting ${lensesToDelete.length} lenses: “${lensesToDelete
                        .map((id) => state.lenses.find((l) => l.id === id)?.name)
                        .join(', ')}”. After this, there should be ${
                        remainingLenses.length
                    } lenses remaining: “${remainingLenses.map((l) => l.name).join(', ')}”`
                )
                return {
                    ...state,
                    lenses: [...remainingLenses],
                    // Clear table row selection (i.e. to reset the Select All box, and to hide the toolbar)
                    selected: [],
                }
            })
        },
        duplicateLenses(lensesToDuplicate: readonly SelectedItem[]) {
            set((state) => {
                const newLenses: LensDefinition[] = compact(
                    lensesToDuplicate.map((id) => {
                        const existingLens = state.lenses.find((lens) => lens.id === id)

                        if (!existingLens) {
                            return undefined
                        }

                        return createLensDefinition({
                            ...existingLens,
                            id: idGenerator.getNext(),
                            name: `${existingLens.name} copy`,
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
