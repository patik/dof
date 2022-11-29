import { Lens } from './Lens'

export function createLensMaker(customDefaults?: Options): (opts?: Options) => Lens {
    return (opts: Options = {}) => {
        return new Lens(opts, customDefaults)
    }
}
