import { Box } from '@mui/material'
import { Lens } from 'dof'
import { useState } from 'react'
import { IDGenerator } from '../utilities/IDGenerator'
import Distance from './Distance'
import { Graph } from './Graph'
import LensList from './LensList/LensList'
import { fullList } from './LensList/sensorList'
import UnitsToggle from './UnitsToggle'
import { compact } from 'lodash'

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
    distance: number
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
    }).dof(distance)

    return {
        ...result,
        depthOfField: rounded(dof),
    }
}

export default function Main() {
    const [units, setUnits] = useState<Units>('metric')
    const [distance, setDistance] = useState<number>(5)
    const [lenses, setLenses] = useState<LensDefinition[]>([
        createLensDefinition(idGenerator.getNext(), 'Lens 1', 35, 'f/2', 'full', distance),
        createLensDefinition(idGenerator.getNext(), 'Lens 2', 55, 'f/1.4', 'mft', distance),
    ])

    const addLens = () => {
        setLenses([
            ...lenses,
            createLensDefinition(idGenerator.getNext(), `Lens ${lenses.length + 1}`, 35, 'f/2', 'full', distance),
        ])
    }

    const updateLens = (lens: LensDefinition) => {
        const lensIndex = lenses.findIndex((r) => r.id === lens.id)
        const newLenses = [...lenses]

        newLenses[lensIndex] = lens

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

                return createLensDefinition(
                    idGenerator.getNext(),
                    `${existingRow.name} copy`,
                    existingRow.focalLength,
                    existingRow.aperture,
                    existingRow.sensorKey,
                    distance
                )
            })
        )

        if (newLenses.length === 0) {
            return
        }

        setLenses([...lenses, ...newLenses])
    }

    return (
        <Box p={2}>
            <Box mb={2}>
                <Distance units={units} distance={distance} setDistance={setDistance} />
            </Box>

            <Box mb={2}>
                <LensList
                    units={units}
                    distance={distance}
                    lenses={lenses}
                    addLens={addLens}
                    updateLens={updateLens}
                    deleteLenses={deleteLenses}
                    duplicateLenses={duplicateLenses}
                />
            </Box>

            <Box mb={2}>
                <UnitsToggle units={units} setUnits={setUnits} />
            </Box>

            <Box mb={2} height={400} width="100%">
                <Graph lenses={lenses} />
            </Box>
        </Box>
    )
}
