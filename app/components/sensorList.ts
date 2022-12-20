// https://en.wikipedia.org/wiki/Image_sensor_format
// http://www.dpreview.com/previews/panasonic-lumix-dmc-gm1/images/Sensors.png
export const fullList = {
    iPhone5: {
        name: 'iPhone 5',
        value: 7.61,
    },
    '8mm': {
        name: 'Standard 8mm film',
        value: 7.28,
    },
    iPhone5S: {
        name: 'iPhone 5S, 1/3" CCD',
        value: 7.21,
    },
    '16mm': {
        name: 'Standard 16mm film',
        value: 3.41,
    },
    '1in': {
        name: '1" CCD, Nikon CX, Sony RX100',
        value: 2.72,
    },
    BlackmagicCC: {
        name: 'Blackmagic Cine Cam',
        value: 3.02,
    },
    mft: {
        name: 'Micro Four-Thirds',
        value: 2,
    },
    '15in': {
        name: '1.5" (Canon G1 X II)',
        value: 1.92,
    },
    APSCCanon: {
        name: 'APS-C (Canon EF-S)',
        value: 1.62,
    },
    '35mm': {
        name: 'Standard 35mm film',
        value: 1.59,
    },
    NikonD3k: {
        name: 'Nikon D3100/D3200',
        value: 1.57,
    },
    APSC: {
        name: 'APS-C (Sony, Nikon, Pentax, Samsung)',
        value: 1.53,
    },
    Super35: {
        name: 'Super 35mm film',
        value: 1.39,
    },
    APSH: {
        name: 'APS-H (Canon 1D)',
        value: 1.29,
    },
    full: {
        name: 'Full Frame',
        value: 1,
    },
    LeicaS: {
        name: 'Leica S',
        value: 0.8,
    },
}

export const shortList: SensorKey[] = ['iPhone5S', 'mft', 'APSC', 'full']
