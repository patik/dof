import { Box } from '@mui/material'
import { Lens } from 'dof'
import { compact } from 'lodash'
import { useMemo, useState } from 'react'
import { IDGenerator } from '../utilities/IDGenerator'
import Distance from './Distance'
import { Graph } from './Graph'
import LensList from './LensList/LensList'
import { fullList } from './sensorList'
import UnitsToggle from './UnitsToggle'

const idGenerator = new IDGenerator()

function rounded(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

function createLensDefinition(
    id: string,
    name: string,
    focalLength: number,
    aperture: string,
    sensorKey: SensorKey,
    distance: number,
    units: Units
): LensDefinition {
    const result = {
        id,
        name,
        aperture,
        focalLength,
        sensorKey,
    }

    const { dof } = new Lens({
        focalLength: result.focalLength,
        aperture: result.aperture,
        cropFactor: fullList[result.sensorKey].value,
        id: result.id,
    }).dof(distance, units === 'imperial')

    return {
        ...result,
        depthOfField: rounded(dof),
    }
}

export default function Main() {
    const [units, setUnits] = useState<Units>('metric')
    const [distance, setDistance] = useState<Distance>(5)
    const [lenses, setLenses] = useState<LensDefinition[]>([
        createLensDefinition(idGenerator.getNext(), 'Lens 1', 35, 'f/2', 'full', distance, units),
        createLensDefinition(idGenerator.getNext(), 'Lens 2', 55, 'f/1.4', 'mft', distance, units),
    ])

    const addLens = useMemo(
        () => () => {
            setLenses([
                ...lenses,
                createLensDefinition(
                    idGenerator.getNext(),
                    `Lens ${lenses.length + 1}`,
                    35,
                    'f/2',
                    'full',
                    distance,
                    units
                ),
            ])
        },
        [distance, lenses, units]
    )

    const updateLens = useMemo(
        () => (lens: LensDefinition) => {
            const lensIndex = lenses.findIndex((r) => r.id === lens.id)
            const newLenses = [...lenses]

            newLenses[lensIndex] = lens

            setLenses(newLenses)
        },
        [lenses]
    )

    const deleteLenses = useMemo(
        () => (lensesToDelete: readonly SelectedItem[]) => {
            if (lensesToDelete.length === 0) {
                return
            }

            const remainingRows: LensDefinition[] = [...lenses].filter((row) => !lensesToDelete.includes(row.id))

            setLenses(remainingRows)
        },
        [lenses]
    )

    const duplicateLenses = useMemo(
        () => (lensesToDuplicate: readonly SelectedItem[]) => {
            const newLenses: LensDefinition[] = compact(
                lensesToDuplicate.map((id) => {
                    const existingRow = lenses.find((row) => row.id === id)

                    if (!existingRow) {
                        console.error('Could not find row to be duplicated ', id)
                        return undefined
                    }

                    return createLensDefinition(
                        idGenerator.getNext(),
                        `${existingRow.name} copy`,
                        existingRow.focalLength,
                        existingRow.aperture,
                        existingRow.sensorKey,
                        distance,
                        units
                    )
                })
            )

            if (newLenses.length === 0) {
                return
            }

            setLenses([...lenses, ...newLenses])
        },
        [distance, lenses, units]
    )

    const onDistanceChange = (newValue: Distance) => {
        setDistance(newValue)

        // Update all stored lenses by recalculating their depths of field
        setLenses(
            lenses.map((lens) =>
                createLensDefinition(
                    lens.id,
                    lens.name,
                    lens.focalLength,
                    lens.aperture,
                    lens.sensorKey,
                    newValue,
                    units
                )
            )
        )
    }

    const onUnitsChange = (newValue: Units) => {
        setUnits(newValue)

        // Update all stored lenses by recalculating their depths of field
        setLenses(
            lenses.map((lens) =>
                createLensDefinition(
                    lens.id,
                    lens.name,
                    lens.focalLength,
                    lens.aperture,
                    lens.sensorKey,
                    distance,
                    newValue
                )
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

            <Box mb={2}>
                <UnitsToggle units={units} onUnitsChange={onUnitsChange} />
            </Box>

            <Box mb={2} height={400} width="100%">
                <Graph lenses={lenses} />
            </Box>
        </Box>
    )
}
