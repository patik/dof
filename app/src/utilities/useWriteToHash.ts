import { useEffect } from 'react'
import useDoFStore from '../store'

export function createHash(distance: Distance, lenses: LensDefinition[]): string {
    const hash = `${distance};${lenses
        .map(
            (lens) =>
                `${encodeURIComponent(lens.name.trim())},${lens.focalLength},${lens.aperture.replace('/', '-')},${
                    lens.sensorKey
                }`
        )
        .join(';')}`
    console.log('hash: ', hash)
    console.log('encoded hash: ', encodeURIComponent(hash))

    return hash
}

export default function useWriteToHash(hasReadFromHash = false) {
    const { distance, lenses } = useDoFStore()

    useEffect(() => {
        if (!hasReadFromHash) {
            console.log('has not read yet')
            return
        }

        window.location.hash = createHash(distance, lenses)
    }, [distance, hasReadFromHash, lenses])
}
