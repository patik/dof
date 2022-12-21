import { format } from 'footinch'

export const metersToFeet = (meters: number | string): string => format.M.to.FT.IN.FRAC(4)(meters)

export const feetAndInchesString = (feetInches: number | string): string => format.FT.to.FT.IN.FRAC(4)(feetInches)

export const feetString = (feet: number | string): string => format.FT.to.FT.IN.FRAC(0)(feet).replace(/\s*0"\s*$/, '')

export function rounded(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100
}
