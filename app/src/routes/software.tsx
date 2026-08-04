import { Link, Typography } from '@mui/material'
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import Layout from '../layout/Layout'
import styles from './software.module.css'

export const Route = createFileRoute('/software')({ component: Software })

function Software() {
    return (
        <Layout
            title="Software: Node.js Package"
            description="Use the dof JavaScript package to calculate depth of field for camera lenses."
        >
            <article className={styles.article}>
                <Typography component="h2" variant="h2" gutterBottom>
                    Node module
                </Typography>
                <Typography gutterBottom>
                    A JavaScript tool for calculating the depth of field of camera lenses.
                </Typography>
                <Typography gutterBottom>
                    Create a lens with aperture, focal length, and crop factor values, then calculate its depth of field
                    for a given subject distance.
                </Typography>

                <Typography component="h3" variant="h3" className={styles.subsectionHeading} gutterBottom>
                    Install
                </Typography>
                <pre className={styles.code}>
                    <code>{`bun add dof

# or: yarn add dof
# or: pnpm add dof
# or: npm install dof`}</code>
                </pre>

                <Typography component="h3" variant="h3" className={styles.subsectionHeading} gutterBottom>
                    Create a lens
                </Typography>
                <pre className={styles.code}>
                    <code>{`import { Lens } from 'dof'

const lens = new Lens({
    focalLength: 35,
    aperture: 'f/2.5',
    cropFactor: 1.62,
})`}</code>
                </pre>
                <Typography gutterBottom>
                    The defaults are a 35 mm focal length, f/2 aperture, and a crop factor of 1 for a full-frame sensor.
                    Lenses may also have arbitrary string IDs.
                </Typography>

                <Typography component="h3" variant="h3" className={styles.subsectionHeading} gutterBottom>
                    Reuse defaults
                </Typography>
                <pre className={styles.code}>
                    <code>{`import { createLensMaker } from 'dof'

const lensMaker = createLensMaker({ cropFactor: 1.62 })
const lens1 = lensMaker()
const lens2 = lensMaker({ aperture: 'f/3.6' })`}</code>
                </pre>

                <Typography component="h3" variant="h3" className={styles.subsectionHeading} gutterBottom>
                    Calculate depth of field
                </Typography>
                <Typography>
                    Pass the distance between the camera and subject in meters, or pass <code>true</code> as the second
                    argument to use feet.
                </Typography>
                <pre className={styles.code}>
                    <code>{`const metricResult = lens.dof(5)
const imperialResult = lens.dof(15, true)

metricResult.dof
metricResult.eighthDof
metricResult.hf
metricResult.near
metricResult.far
metricResult.coc
metricResult.toString()`}</code>
                </pre>
                <Typography>
                    Results include the total depth of field, one-eighth depth of field, hyperfocal distance, near and
                    far limits, focal-length equivalency, and circle of confusion. Distance values may be{' '}
                    <code>Infinity</code>.
                </Typography>

                <Typography component="h3" variant="h3" className={styles.subsectionHeading} gutterBottom>
                    Use standalone calculators
                </Typography>
                <Typography gutterBottom>
                    For calculations that do not need a <code>Lens</code> instance, the package exports functions for
                    calculating depth of field, aperture, crop factor, and focal length directly.
                </Typography>
                <pre className={styles.code}>
                    <code>{`import { calculateDepthOfField } from 'dof'

const result = calculateDepthOfField({
    focalLength: 35,
    aperture: 2,
    cropFactor: 1,
    distance: 5,
})`}</code>
                </pre>
                <Typography>
                    Metric units are used by default. Pass <code>imperialUnits: true</code> to use feet. See the{' '}
                    <Link href="https://github.com/patik/dof/tree/main/package#use-the-standalone-calculators">
                        package README
                    </Link>{' '}
                    for examples of <code>calculateAperture</code>, <code>calculateCropFactor</code>, and{' '}
                    <code>calculateFocalLength</code>.
                </Typography>

                <Typography component="h3" variant="h3" className={styles.subsectionHeading} gutterBottom>
                    TypeScript
                </Typography>
                <Typography>
                    The package includes its own declarations and exports input and result types for its calculators.
                </Typography>

                <Typography component="h2" variant="h2" className={styles.webHeading} gutterBottom>
                    Web app
                </Typography>
                <Typography>
                    <Link href="https://patik.com/dof/">Compare multiple lenses side by side</Link>, or read the{' '}
                    <RouterLink
                        to="/about"
                        className="text-accent-strong underline decoration-accent/40 underline-offset-4"
                    >
                        calculator documentation
                    </RouterLink>
                    .
                </Typography>
            </article>
        </Layout>
    )
}
