// Map of human-friendly values with the actual values
const apertureMap: Record<string, number> = {
    'f/1': 1,
    'f/1.2': 1.189207,
    'f/1.4': 1.414214,
    'f/1.6': 1.587401,
    'f/1.7': 1.681793,
    'f/1.8': 1.781797,
    'f/2': 2.0,
    'f/2.2': 2.244924,
    'f/2.4': 2.378414,
    'f/2.5': 2.519842,
    'f/2.8': 2.828427,
    'f/3.2': 3.174802,
    'f/3.4': 3.363586,
    'f/3.6': 3.563595,
    'f/4': 4.0,
    'f/4.5': 4.489848,
    'f/4.8': 4.756828,
    'f/5': 5.039684,
    'f/5.6': 5.656854,
    'f/6.4': 6.349604,
    'f/6.7': 6.727171,
    'f/7.1': 7.12719,
    'f/8': 8.0,
    'f/9': 8.979696,
    'f/9.5': 9.513657,
    'f/10': 10.07937,
    'f/11': 11.313708,
    'f/12.7': 12.699208,
    'f/13.5': 13.454343,
    'f/14.3': 14.254379,
    'f/16': 16.0,
    'f/18': 17.959393,
    'f/19': 19.027314,
    'f/20': 20.158737,
    'f/22': 22.627417,
    'f/25': 25.398417,
    'f/27': 26.908685,
    'f/28': 28.508759,
    'f/32': 32,
    'f/45': 45.254834,
    'f/64': 64,
}

export function getActualAperture(humanValue: string): number | undefined {
    if (
        humanValue in apertureMap &&
        Object.prototype.hasOwnProperty.call(apertureMap, humanValue) &&
        apertureMap[humanValue]
    ) {
        return apertureMap[humanValue]
    }

    // Jest needs an explicit return for each code path
    return
}
