var DoF = require('./index')

describe('Module basics', () => {
    afterEach(() => {
        // Reset defaults
        DoF.setDefaults({ focalLength: 35, aperture: 2, cropFactor: 1, distance: 20 })
    })

    test('constructor will create an object with the default settings', () => {
        var lens = new DoF()

        expect(lens.focalLength).toBe(35)
        expect(lens.aperture).toBe(2)
        expect(lens.cropFactor).toBe(1)
    })

    test('constructor will create an object with the provided settings', () => {
        var lens = new DoF(40, 'f/2.5', 1.62, 1234, 'My Lens')

        expect(lens.focalLength).toBe(40)
        expect(lens.aperture).toBe(2.5)
        expect(lens.cropFactor).toBe(1.62)
        expect(lens.name).toBe('My Lens')
        expect(lens.id).toBe(1234)
    })

    test('changes to default settings are accepted and applied', () => {
        // First, create a lens with the original defaults
        var lens1 = new DoF()

        // Then change the defaults
        DoF.setDefaults({ focalLength: 40, aperture: 3.5, cropFactor: 1.62, distance: 25 })

        // Make a new lens, which should receive the new defaults
        var lens2 = new DoF()

        expect(lens1.focalLength).toBe(35)
        expect(lens1.aperture).toBe(2)
        expect(lens1.cropFactor).toBe(1)

        expect(lens2.focalLength).toBe(40)
        expect(lens2.aperture).toBe(3.5)
        expect(lens2.cropFactor).toBe(1.62)
    })
})

describe('Calculating the depth of field', () => {
    test('with default settings', () => {
        var lens = new DoF()
        var result = lens.getResult()

        expect(result.dof).toBe(13.1)
        expect(result.dof.toString()).toBe('13.1')
        expect(result.toString()).toBe('13\' 1.2"')

        expect(result.eighthDof).toBe(1.6416666666666666)
        expect(result.eighthDof.toString()).toBe('1.6416666666666666')

        expect(result.hf).toBe(67.1)
        expect(result.hf.toString()).toBe('67.1')

        expect(result.near).toBe(15.341666666666667)
        expect(result.near.toString()).toBe('15.341666666666667')

        expect(result.far).toBe(28.441666666666666)
        expect(result.far.toString()).toBe('28.441666666666666')

        expect(result.coc).toBe(0.03)
        expect(result.coc.toString()).toBe('0.03')
    })

    test('with a specific distance value', () => {
        var lens = new DoF()
        var result = lens.getResult(15)

        expect(result.dof).toBe(7.083333333333333)
        expect(result.dof.toString()).toBe('7.083333333333333')
        expect(result.toString()).toBe('7\' 1.0"')

        expect(result.eighthDof).toBe(0.8833333333333333)
        expect(result.eighthDof.toString()).toBe('0.8833333333333333')

        expect(result.hf).toBe(67.1)
        expect(result.hf.toString()).toBe('67.1')

        expect(result.near).toBe(12.208333333333334)
        expect(result.near.toString()).toBe('12.208333333333334')

        expect(result.far).toBe(19.283333333333335)
        expect(result.far.toString()).toBe('19.283333333333335')

        expect(result.coc).toBe(0.03)
        expect(result.coc.toString()).toBe('0.03')
    })
})
