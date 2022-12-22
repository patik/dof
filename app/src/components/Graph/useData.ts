import { useMediaQuery, useTheme } from '@mui/material'
import { Serie } from '@nivo/line'
import { Lens } from 'dof'
import { compact } from 'lodash'
import { useMemo } from 'react'
import useDoFStore from '../../store'
import sensorList from '../../utilities/sensorList'
import { getDistanceSteps } from './getDistanceSteps'
import { getUniqueLensNames } from './getUniqueLensNames'

export function useData() {
    const { lenses, units } = useDoFStore()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const distances = useMemo(() => getDistanceSteps(units, isMobile), [units, isMobile])
    const uniqueNames = getUniqueLensNames(lenses)
    const data: Serie[] = useMemo(
        () =>
            lenses.map((lens) => {
                const { focalLength, aperture, sensorKey, id } = lens
                const cropFactor: number = sensorList[sensorKey].value
                const datum: Serie = {
                    id: uniqueNames[lens.id],
                    data: compact(
                        distances.map((distance) => {
                            const { dof: dofLength } = new Lens({ focalLength, aperture, cropFactor, id }).dof(distance)

                            // The graph doesn't handle infinite values well
                            if (dofLength === Infinity) {
                                return
                            }

                            return {
                                x: distance,
                                y: dofLength,
                            }
                        })
                    ),
                }

                return datum
            }),
        [distances, lenses, uniqueNames]
    )

    return data
}
