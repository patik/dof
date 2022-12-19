import { Lens } from 'dof'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { AxisOptions, Chart as ChartType } from 'react-charts'

// Gets around issue with importing D3 via CJS in Next
// https://github.com/TanStack/react-charts/issues/324#issuecomment-1330610744
const Chart = dynamic(() => import('react-charts').then((mod) => mod.Chart), {
    ssr: false,
}) as typeof ChartType

type Series = {
    label: string
    data: LensResult[]
}

const data: Series[] = [
    {
        label: 'Lens 1',
        data: [
            {
                distance: 2,
                dofLength: 3,
            },
            {
                distance: 3,
                dofLength: 6,
            },
            {
                distance: 4,
                dofLength: 9,
            },
        ],
    },
    {
        label: 'Lens 2',
        data: [
            {
                distance: 2,
                dofLength: 4,
            },
            {
                distance: 3,
                dofLength: 8,
            },
            {
                distance: 4,
                dofLength: 16,
            },
        ],
    },
]

export function Graph({ lenses }: { lenses: Inputs[] }) {
    const primaryAxis = useMemo(
        (): AxisOptions<LensResult> => ({
            getValue: (datum) => datum.distance,
        }),
        []
    )

    const secondaryAxes = useMemo(
        (): AxisOptions<LensResult>[] => [
            {
                getValue: (datum) => datum.dofLength,
            },
        ],
        []
    )

    const distances = [0, 5, 10, 15, 20, 25]
    const data: Series[] = []

    lenses.forEach((lens) => {
        const datum: Series = {
            label: lens.name,
            data: [],
        }

        distances.forEach((distance) => {
            const { dof } = new Lens({ ...lens })

            datum.data.push({
                distance,
                dofLength: dof().dof,
            })
        })

        data.push(datum)
    })

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
