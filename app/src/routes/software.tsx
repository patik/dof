import { Box, Link, Typography } from '@mui/material'
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import Layout from '../layout/Layout'

export const Route = createFileRoute('/software')({ component: Software })

const codeStyles = {
    backgroundColor: 'action.hover',
    borderRadius: 1,
    overflowX: 'auto',
    padding: 2,
}

function Software() {
    return (
        <Layout title="Software: Node.js Package" noMainHeading>
            <Typography component="h1" variant="h3" gutterBottom>
                <Link href="https://patik.com/dof/">Depth of Field Calculator</Link>
            </Typography>
            <Typography paragraph>A JavaScript tool for calculating the depth of field of camera lenses.</Typography>

            <Typography component="h2" variant="h4" gutterBottom>
                Node module
            </Typography>
            <Typography paragraph>
                Create a lens with aperture, focal length, and crop factor values, then calculate its depth of field for
                a given subject distance.
            </Typography>

            <Typography component="h3" variant="h5" gutterBottom>
                Install
            </Typography>
            <Box component="pre" sx={codeStyles}>
                <code>bun add dof</code>
            </Box>

            <Typography component="h3" variant="h5" gutterBottom>
                Create a lens
            </Typography>
            <Box component="pre" sx={codeStyles}>
                <code>{`import { Lens } from 'dof'

const lens = new Lens({
    focalLength: 35,
    aperture: 'f/2.5',
    cropFactor: 1.62,
})`}</code>
            </Box>
            <Typography paragraph>
                The defaults are a 35 mm focal length, f/2 aperture, and a crop factor of 1 for a full-frame sensor.
                Lenses may also have arbitrary string IDs.
            </Typography>

            <Typography component="h3" variant="h5" gutterBottom>
                Reuse defaults
            </Typography>
            <Box component="pre" sx={codeStyles}>
                <code>{`import { createLensMaker } from 'dof'

const lensMaker = createLensMaker({ cropFactor: 1.62 })
const lens1 = lensMaker()
const lens2 = lensMaker({ aperture: 'f/3.6' })`}</code>
            </Box>

            <Typography component="h3" variant="h5" gutterBottom>
                Calculate depth of field
            </Typography>
            <Typography paragraph>
                Pass the distance between the camera and subject in meters, or pass <code>true</code> as the second
                argument to use feet.
            </Typography>
            <Box component="pre" sx={codeStyles}>
                <code>{`const metricResult = lens.dof(5)
const imperialResult = lens.dof(15, true)

metricResult.dof
metricResult.eighthDof
metricResult.hf
metricResult.near
metricResult.far
metricResult.coc
metricResult.toString()`}</code>
            </Box>
            <Typography paragraph>
                Results include the total depth of field, one-eighth depth of field, hyperfocal distance, near and far
                limits, focal-length equivalency, and circle of confusion. Distance values may be <code>Infinity</code>.
            </Typography>

            <Typography component="h3" variant="h5" gutterBottom>
                TypeScript
            </Typography>
            <Typography paragraph>
                The package includes its own declarations. The calculator also exports the{' '}
                <code>DepthOfFieldDetails</code> result type.
            </Typography>

            <Typography component="h2" variant="h4" gutterBottom>
                Web app
            </Typography>
            <Typography paragraph>
                <Link href="https://patik.com/dof/">Compare multiple lenses side by side</Link>, or read the{' '}
                <RouterLink to="/about">calculator documentation</RouterLink>.
            </Typography>
        </Layout>
    )
}
