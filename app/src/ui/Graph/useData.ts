import { Lens } from 'dof'
import { useMemo } from 'react'
import useDoFStore from '../../store'
import sensorList from '../../utilities/sensorList'
import useIsMobile from '../../utilities/useIsMobile'
import type { ChartSeries } from './chartTypes'
import getDistanceSteps from './getDistanceSteps'
import getUniqueLensNames from './getUniqueLensNames'

export default function useData(): ChartSeries[] {
    const { lenses, units } = useDoFStore()
    const isMobile = useIsMobile()
    const distances = useMemo(() => getDistanceSteps(units, isMobile), [units, isMobile])
    const uniqueNames = getUniqueLensNames(lenses)
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
                    hyperfocal: calculator.dof(1, units === 'imperial').hf,
                    points,
                }

                return datum
            }),
        [distances, lenses, uniqueNames, units],
    )

    return data
}
