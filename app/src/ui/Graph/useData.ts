import { Lens } from 'dof'
import { useMemo } from 'react'
import useDoFStore from '../../store'
import sensorList from '../../utilities/sensorList'
import type { ChartSeries } from './chartTypes'
import getDistanceSteps from './getDistanceSteps'
import getUniqueLensNames from './getUniqueLensNames'

export default function useData(
    /**
     * `compact` comes from the chart's own measured width so that sampling density and
     * chart layout always switch at the same point.
     */
    compact: boolean,
): ChartSeries[] {
    const { lenses, units } = useDoFStore()
    const distances = useMemo(() => getDistanceSteps(units, compact), [units, compact])
    const uniqueNames = useMemo(() => getUniqueLensNames(lenses), [lenses])
    const data = useMemo(
        () =>
            lenses.map((lens) => {
                const { focalLength, aperture, sensorKey, id } = lens
                const cropFactor: number = sensorList[sensorKey].value
                const calculator = new Lens({ focalLength, aperture, cropFactor, id })
                const points = distances.map((distance) => {
                    if (distance === 0) {
                        return { distance, dof: 0 }
                    }

                    const { dof } = calculator.dof(distance, units === 'imperial')
                    return { distance, dof }
                })
                const datum: ChartSeries = {
                    id: uniqueNames[lens.id] ?? lens.name,
                    lensId: lens.id,
                    // The hyperfocal distance does not depend on subject distance, so any
                    // distance may be passed here just to read `hf` back out.
                    hyperfocal: calculator.dof(1, units === 'imperial').hf,
                    points,
                }

                return datum
            }),
        [distances, lenses, uniqueNames, units],
    )

    return data
}
