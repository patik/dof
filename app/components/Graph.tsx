import Box from '@mui/material/Box'
import { Lens } from 'dof'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { AxisOptions, Chart as ChartType } from 'react-charts'
import { fullList } from './LensList/sensorList'

// Gets around issue with importing D3 via CJS in Next
// https://github.com/TanStack/react-charts/issues/324#issuecomment-1330610744
const Chart = dynamic(() => import('react-charts').then((mod) => mod.Chart), {
    ssr: false,
}) as typeof ChartType

type LensDatum = {
    distance: number
    dofLength: number
}

type Series = {
    label: string
    data: LensDatum[]
}

export function Graph({ lenses }: { lenses: LensInputs[] }) {
    const primaryAxis = useMemo(
        (): AxisOptions<LensDatum> => ({
            getValue: (datum) => datum.distance,
        }),
        []
    )

    const secondaryAxes = useMemo(
        (): AxisOptions<LensDatum>[] => [
            {
                getValue: (datum) => datum.dofLength,
            },
        ],
        []
    )

    const distances = useMemo(() => Array.from(Array(25).keys()), [])
    const data: Series[] = useMemo(() => {
        return lenses.map((lens) => {
            const { focalLength, aperture, sensorKey, id } = lens
            const cropFactor: number = fullList[sensorKey].value
            const datum: Series = {
                label: lens.name,
                data: [],
            }

            distances.forEach((distance) => {
                console.log('distance ', distance)
                const { dof: dofLength } = new Lens({ focalLength, aperture, cropFactor, id }).dof(distance)

                if (dofLength !== Infinity) {
                    console.log('Adding datum: ', {
                        distance,
                        dofLength,
                    })
                    datum.data.push({
                        distance,
                        dofLength,
                    })
                }
            })

            return datum
        })
    }, [distances, lenses])

    console.log('data ', data)

    return (
        <Chart
            options={{
                data,
                primaryAxis,
                secondaryAxes,
            }}
        />
    )
}
