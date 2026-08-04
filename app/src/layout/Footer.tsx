import { Grid, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import Permalink from './Permalink'

export default function Footer({ hasPermalink }: { hasPermalink?: boolean }) {
    return (
        <Grid container component="footer" mb={3} textAlign="center">
            <Grid size={{ xs: 3 }}>
                <Typography variant="body2">
                    {hasPermalink ? <Permalink /> : <Link to="/">Back to the calculator</Link>}
                </Typography>
            </Grid>
            <Grid size={{ xs: 3 }}>
                <Typography variant="body2">
                    <Link to="/about">How to use</Link>
                </Typography>
            </Grid>
            <Grid size={{ xs: 3 }}>
                <Typography variant="body2">
                    <a href="https://github.com/patik/dof/issues">Feedback</a>
                </Typography>
            </Grid>
            <Grid size={{ xs: 3 }}>
                <Typography variant="body2">
                    <Link to="/software">Tech & software details</Link>
                </Typography>
            </Grid>
        </Grid>
    )
}
