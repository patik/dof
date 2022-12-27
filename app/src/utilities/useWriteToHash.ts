import { useEffect } from 'react'
import useDoFStore from '../store'
import { createLensDefinition } from '../store/lensSlice'
import areDuplicateLenses from './areDuplicateLenses'
import placeholderLenses from './placeholderLenses'

export function createHash(distance: Distance, units: Units, lenses: LensDefinition[]): string {
    const hash = `${distance},${units.charAt(0)};${lenses
        .map(
            (lens) =>
                `${encodeURIComponent(lens.name.trim())},${lens.focalLength},${lens.aperture.replace('/', '-')},${
                    lens.sensorKey
                }`
        )
        .join(';')}`

    return hash
}

export default function useWriteToHash(hasReadFromHash = false) {
    const { distance, units, lenses } = useDoFStore()

    useEffect(() => {
        if (!hasReadFromHash) {
            return
        }

        // Filter out the placeholder lenses
        const lensesToIncludeInHash = lenses.filter(
            (stateLens) =>
                !placeholderLenses.some((placeholderLens) =>
                    areDuplicateLenses(stateLens, createLensDefinition(placeholderLens))
                )
        )

        if (lensesToIncludeInHash.length === 0) {
            console.log('no non-placeholder lenses left for the hash')
            return
        }

        window.location.hash = createHash(distance, units, lensesToIncludeInHash)
    }, [distance, hasReadFromHash, lenses, units])
}
