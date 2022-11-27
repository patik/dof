/**
 * Convert millimeters to feet
 *
 * @param  dist     Length in millimeters
 * @return          Length (feet/inches) as a decimal, or infinity
 */
export function mmToFeet(dist: number): string {
    // Convert millimeters to inches
    const inches = dist / 25.4

    if (inches === Infinity) {
        return 'Infinity'
    } else {
        return Math.floor(inches / 12) + "' " + (inches % 12).toFixed(1) + '"'
    }
}
