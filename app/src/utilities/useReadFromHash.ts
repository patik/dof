import { isApertureString } from 'dof'
import { useEffect, useState } from 'react'
import useDoFStore from '../store'
import { createLensDefinition, DEFAULT_DISTANCE, DEFAULT_UNITS } from '../store/lensSlice'
import { isSensorKey } from './isSensorKey'

function parseDistanceAndUnits(piece: string): { distance: Distance; units: Units } {
    let distance: Distance = 5
    let units: Units = DEFAULT_UNITS

    const parts = piece.split(',')
    const [distancePart = '', unitsPart] = parts
    const parsedDistance = Number.parseFloat(distancePart)

    distance = parsedDistance

    if (Number.isNaN(distance)) {
        if (process.env.NODE_ENV !== 'test') {
            console.error(`distance could not be parsed from “${distancePart}”`)
        }

        // Use default value
        distance = DEFAULT_DISTANCE
    }

    if (parts.length === 1 && !Number.isNaN(parsedDistance)) {
        // Pre-2023, the units were not in the URL, and only imperial units were supported, so assume that this is an old URL from those times
        units = 'imperial'
    } else {
        units = unitsPart === 'i' ? 'imperial' : 'metric'
    }

    return { distance, units }
}

type ParsedLens = Omit<LensInputs, 'id'>

/**
 *
 * @example 'Lens%201,35,f-2,APSC;Lens%202,35,f-2,full;Lens%203,35,f-2,APSC;Lens%204,35,f-2,APSC;Lens%205,35,f-2,APSC'
 */
function parseLenses(pieces: string[]): ParsedLens[] {
    return pieces
        .map((piece): ParsedLens | undefined => {
            const lensParts = piece.split(',')

            if (lensParts.length !== 4) {
                console.error(`lens had wrong number of parts: “${piece}”`)
                return undefined
            }

            const [encodedName = '', focalLengthPart = '', aperturePart = '', sensorKey = ''] = lensParts
            const name = decodeURIComponent(encodedName)
            const focalLength: ParsedLens['focalLength'] = parseInt(focalLengthPart, 10)
            const aperture = aperturePart.replace('-', '/')

            if (!isApertureString(aperture)) {
                return undefined
            }

            if (!isSensorKey(sensorKey)) {
                return undefined
            }

            return { name, focalLength, aperture, sensorKey }
        })
        .filter((lens): lens is ParsedLens => lens !== undefined)
}

/**
 *
 * @example https://patik.com/dof/#20;Lens%201,35,f-2,APSC;Lens%202,35,f-2,full;Lens%203,35,f-2,APSC;Lens%204,35,f-2,APSC;Lens%205,35,f-2,APSC
 */
export function parseHash(hash: string): { distance: Distance; lenses: LensDefinition[]; units: Units } {
    const pieces = hash.split(';')

    if (pieces.length === 0) {
        console.log('hash did not contain any pieces')
    }

    const { distance, units } = parseDistanceAndUnits(pieces[0] ?? '')
    const lenses = parseLenses(pieces.slice(1)).map((lens) => {
        return createLensDefinition({ distance, units: 'metric', ...lens })
    })

    return { distance, lenses, units }
}

export default function useReadFromHash(): boolean {
    const [hasRead, setHasRead] = useState(false)
    const { addLens, setDistance, setUnits } = useDoFStore()

    // Read from localStorage
    // React Strict Mode runs this hook twice in development, so duplicate lenses are skipped.
    useEffect(() => {
        if (hasRead || typeof window === 'undefined') {
            return
        }

        // Don't try to read more than once
        setHasRead(true)

        const hash = window.location.hash.replace(/^#/, '')

        if (hash.length === 0) {
            return
        }

        const { lenses, distance, units } = parseHash(hash)

        setDistance(distance)
        setUnits(units)
        lenses.forEach((lens) => {
            addLens(lens, true)
        })
    }, [addLens, hasRead, setDistance, setUnits])

    return hasRead
}
