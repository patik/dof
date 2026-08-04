/**
 * Derives the hyperfocal distance from a depth-of-field range
 *
 * All values are in millimeters. When the far limit reaches infinity it carries no information, so the near limit is
 * used to derive the result instead.
 */
export function hyperfocalFromDepthOfField({
    mmDist,
    mmNear,
    mmFar,
    focalLength,
}: {
    mmDist: number
    mmNear: number
    mmFar: number
    focalLength: number
}): number {
    if (Number.isFinite(mmFar)) {
        return (mmDist * (mmFar - focalLength)) / (mmFar - mmDist)
    }

    return (mmDist * focalLength + mmNear * mmDist - 2 * mmNear * focalLength) / (mmDist - mmNear)
}
