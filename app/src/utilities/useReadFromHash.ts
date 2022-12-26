import { isApertureString } from 'dof'
import { compact } from 'lodash'
import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import { createLensDefinition, DEFAULT_DISTANCE } from '../store/lensSlice'
import { isSensorKey } from './isSensorKey'

function parseDistance(value: string): Distance {
    let distance: Distance = 5

    distance = parseInt(value, 10)

    if (isNaN(distance)) {
        console.log(`distance could not be parsed from “${value}”`)
        // Use default value
        distance = DEFAULT_DISTANCE
    }

    return distance
}

type ParsedLens = Omit<LensInputs, 'id'>

/**
 *
 * @example 'Lens%201,35,f-2,APSC;Lens%202,35,f-2,full;Lens%203,35,f-2,APSC;Lens%204,35,f-2,APSC;Lens%205,35,f-2,APSC'
 */
function parseLenses(pieces: string[]): ParsedLens[] {
    return compact(
        pieces.map((piece): ParsedLens | undefined => {
            // console.log('piece: ', piece)
            const lensParts = piece.split(',')
            // console.log('lensParts: ', lensParts)

            if (lensParts.length !== 4) {
                // console.log(`lens had wrong number of parts: “${piece}”`)
            }

            const name = decodeURIComponent(lensParts[0])
            const focalLength: ParsedLens['focalLength'] = parseInt(lensParts[1], 10)
            // console.log('lensParts[2]: ', lensParts[2])
            const aperture = lensParts[2].replace('-', '/')

            if (!isApertureString(aperture)) {
                // console.log(`invalid aperture: “${lensParts[2]}”`)
                return
            }

            const sensorKey = lensParts[3]

            if (!isSensorKey(sensorKey)) {
                return
            }

            return { name, focalLength, aperture, sensorKey }
        })
    )
}

/**
 *
 * @example http://patik.com/dof/#20;Lens%201,35,f-2,APSC;Lens%202,35,f-2,full;Lens%203,35,f-2,APSC;Lens%204,35,f-2,APSC;Lens%205,35,f-2,APSC
 */
export function parseHash(hash: string): { distance: Distance; lenses: LensDefinition[] } {
    const pieces = hash.split(';')

    if (pieces.length === 0) {
        console.log('hash did not contain any pieces')
    }

    const distance = parseDistance(pieces[0])
    const lenses = parseLenses(pieces.slice(1)).map((lens) => {
        // console.log('creating lens from: ', { distance, units: 'metric', ...lens })
        return createLensDefinition({ distance, units: 'metric', ...lens })
    })

    return { distance, lenses }
}

export default function useReadFromHash(): boolean {
    const [hasStartedReading, setHasStartedReading] = useState(false)
    const [hasFinishedReading, setHasFinishedReading] = useState(false)
    const { addLens, applyFromLocalStorage } = useDoFStore()

    // Read from localStorage
    // Note that on Next.js dev server this hook will run twice, causing duplicate lenses to be added to state
    useEffect(() => {
        if (hasStartedReading || hasFinishedReading || typeof window === 'undefined') {
            return
        }

        // Don't try to read more than once
        setHasStartedReading(true)

        const hash = window.location.hash.replace(/^#/, '')
        console.log('[read] raw hash: ', hash)
        console.log('[read] decoded hash: ', decodeURIComponent(hash))

        if (hash.length === 0) {
            setHasFinishedReading(true)
            return
        }

        setHasFinishedReading(true)
    }, [addLens, applyFromLocalStorage, hasFinishedReading, hasStartedReading])

    return hasFinishedReading
}
