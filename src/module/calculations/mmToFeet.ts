/**
 * Convert millimeters to feet
 *
 * @param  dist     Length in millimeters
 * @return {String} Length (feet/inches) as a decimal, or infinity
 */
export function mmToFeet(dist: number): string {
    // Convert millimeters to inches
    dist = dist / 25.4

    if (dist === Infinity) {
        return 'Infinity'
    } else {
        return Math.floor(dist / 12) + "' " + (dist % 12).toFixed(1) + '"'
    }
}
