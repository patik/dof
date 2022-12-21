import { Box } from '@mui/material'
import { Lens } from 'dof'
import { compact } from 'lodash'
import { useState } from 'react'
import { rounded } from '../utilities/conversion'
import { IDGenerator } from '../utilities/IDGenerator'
import Distance from './Distance'
import { Graph } from './Graph'
import LensList from './LensList/LensList'
import { fullList } from './sensorList'
import UnitsToggle from './UnitsToggle'

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
    console.log('new DOF: ', rounded(dof))

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

export default function Main() {
    const [units, setUnits] = useState<Units>(initialUnits)
    const [distance, setDistance] = useState<Distance>(initialDistance)
    const [lenses, setLenses] = useState<LensDefinition[]>(initialLensState)

    const addLens = () => {
        setLenses([
            ...lenses,
            createLensDefinition({
                id: idGenerator.getNext(),
                name: `Lens ${lenses.length + 1}`,
                focalLength: 35,
                aperture: 'f/2',
                sensorKey: 'full',
                distance,
                units,
            }),
        ])
    }

    const updateLens = (lens: LensDefinition) => {
        const lensIndex = lenses.findIndex((r) => r.id === lens.id)
        const newLenses = [...lenses]

        newLenses[lensIndex] = createLensDefinition({
            ...lens,
            distance,
            units,
        })

        setLenses(newLenses)
    }

    const deleteLenses = (lensesToDelete: readonly SelectedItem[]) => {
        if (lensesToDelete.length === 0) {
            return
        }

        const remainingRows: LensDefinition[] = [...lenses].filter((row) => !lensesToDelete.includes(row.id))

        setLenses(remainingRows)
    }

    const duplicateLenses = (lensesToDuplicate: readonly SelectedItem[]) => {
        const newLenses: LensDefinition[] = compact(
            lensesToDuplicate.map((id) => {
                const existingRow = lenses.find((row) => row.id === id)

                if (!existingRow) {
                    console.error('Could not find row to be duplicated ', id)
                    return undefined
                }

                return createLensDefinition({
                    ...existingRow,
                    id: idGenerator.getNext(),
                    name: `${existingRow.name} copy`,
                    distance,
                    units,
                })
            })
        )

        if (newLenses.length === 0) {
            return
        }

        setLenses([...lenses, ...newLenses])
    }

    const onDistanceChange = (newValue: Distance) => {
        setDistance(newValue)

        // Update all stored lenses by recalculating their depths of field
        setLenses(
            lenses.map((lens) =>
                createLensDefinition({
                    ...lens,
                    distance: newValue,
                    units,
                })
            )
        )
    }

    const onUnitsChange = (newValue: Units) => {
        setUnits(newValue)

        // Update all stored lenses by recalculating their depths of field
        setLenses(
            lenses.map((lens) =>
                createLensDefinition({
                    ...lens,
                    distance,
                    units: newValue,
                })
            )
        )
    }

    return (
        <Box p={2}>
            <Box mb={2} textAlign="right">
                <Distance units={units} distance={distance} onDistanceChange={onDistanceChange} />
            </Box>

            <Box mb={2}>
                <LensList
                    units={units}
                    lenses={lenses}
                    addLens={addLens}
                    updateLens={updateLens}
                    deleteLenses={deleteLenses}
                    duplicateLenses={duplicateLenses}
                />
            </Box>

            <Box mb={2} textAlign="right">
                <UnitsToggle units={units} onUnitsChange={onUnitsChange} />
            </Box>

            <Box mb={2} height={400} width="100%">
                <Graph lenses={lenses} units={units} />
            </Box>
        </Box>
    )
}
