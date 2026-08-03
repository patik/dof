import { LineSeries } from '@nivo/line'
import { Lens } from 'dof'
import { useMemo } from 'react'
import useDoFStore from '../../store'
import sensorList from '../../utilities/sensorList'
import useIsMobile from '../../utilities/useIsMobile'
import getDistanceSteps from './getDistanceSteps'
import getUniqueLensNames from './getUniqueLensNames'

export default function useData() {
    const { lenses, units } = useDoFStore()
    const isMobile = useIsMobile()
    const distances = useMemo(() => getDistanceSteps(units, isMobile), [units, isMobile])
    const uniqueNames = getUniqueLensNames(lenses)
    const data: LineSeries[] = useMemo(
        () =>
            lenses.map((lens) => {
                const { focalLength, aperture, sensorKey, id } = lens
                const cropFactor: number = sensorList[sensorKey].value
                const datum: LineSeries = {
                    id: uniqueNames[lens.id] ?? lens.name,
                    data: distances
                        .map((distance) => {
                            const { dof: dofLength } = new Lens({ focalLength, aperture, cropFactor, id }).dof(distance)

                            // The graph doesn't handle infinite values well
                            if (!Number.isFinite(dofLength)) {
                                return
                            }

                            return {
                                x: distance,
                                y: dofLength,
                            }
                        })
                        .filter((point): point is { x: number; y: number } => point !== undefined),
                }

                return datum
            }),
        [distances, lenses, uniqueNames]
    )

    return data
}
