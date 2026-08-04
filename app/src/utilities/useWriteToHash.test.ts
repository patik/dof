import { Lens } from 'dof'
import { createHash } from './useWriteToHash'

const depthOfField = new Lens().dof(5)

describe('createHash', () => {
    test('simple example with one lens', () => {
        expect(
            createHash(5, 'metric', [
                {
                    name: 'Alpha bravo',
                    aperture: 'f/3.4',
                    focalLength: 55,
                    sensorKey: 'APSC',
                    depthOfField,
                    id: '7',
                },
            ]),
        ).toBe('5,m;Alpha%20bravo,55,f-3.4,APSC')
    })

    test('with two lenses', () => {
        expect(
            createHash(15, 'metric', [
                {
                    name: 'Alpha bravo',
                    aperture: 'f/3.4',
                    focalLength: 55,
                    sensorKey: 'APSC',
                    depthOfField,
                    id: '7',
                },
                {
                    name: 'Charlie->Delta',
                    aperture: 'f/2',
                    focalLength: 200,
                    sensorKey: 'full',
                    depthOfField,
                    id: '7',
                },
            ]),
        ).toBe('15,m;Alpha%20bravo,55,f-3.4,APSC;Charlie-%3EDelta,200,f-2,full')
    })
})
