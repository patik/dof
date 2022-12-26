// https://en.wikipedia.org/wiki/Image_sensor_format
// http://www.dpreview.com/previews/panasonic-lumix-dmc-gm1/images/Sensors.png
// 35mm diagonal ÷ your sensor’s diagonal = crop factor.
// your sensor’s diagonal = sqrt(h^2 + w^2)
const fullList = {
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
    iPhone13: {
        name: 'iPhone 13 (2021) and earlier',
        value: 3.71, // 42.75mm2, or 5.7x7.5mm
    },
    '16mm': {
        name: 'Standard 16mm film',
        value: 3.41,
    },
    '1in': {
        name: '1" CCD, Nikon CX, Sony RX100',
        value: 2.72,
    },
    iPhone14: {
        name: 'iPhone 14 (2022)',
        value: 2.86, // 9.8x7.3mm, or 71.54mm^2
        isCommon: true,
    },
    BlackmagicCC: {
        name: 'Blackmagic Cine Cam',
        value: 3.02,
    },
    mft: {
        name: 'Micro Four-Thirds',
        value: 2,
        isCommon: true,
    },
    '15in': {
        name: '1.5" (Canon G1 X II)',
        value: 1.92,
    },
    APSCCanon: {
        name: 'APS-C (Canon EF-S)',
        value: 1.62,
        isCommon: true,
    },
    '35mm': {
        name: 'Standard 35mm film',
        value: 1.59,
        isCommon: true,
    },
    NikonD3k: {
        name: 'Nikon D3100/D3200',
        value: 1.57,
    },
    APSC: {
        name: 'APS-C (Sony, Nikon, Pentax, Samsung)',
        value: 1.53,
        isCommon: true,
    },
    Super35: {
        name: 'Super 35mm film',
        value: 1.39,
    },
    APSH: {
        name: 'APS-H (Canon 1D)',
        value: 1.29,
        isCommon: true,
    },
    full: {
        name: 'Full Frame',
        value: 1, // 36x24 mm = 864m^2
        isCommon: true,
    },
    LeicaS: {
        name: 'Leica S',
        value: 0.8,
    },
    Medium: {
        name: 'Medium format',
        value: 0.65,
    },
}

export type SensorKey = keyof typeof fullList

export default fullList
