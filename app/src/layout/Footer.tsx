import { Grid, Typography } from '@mui/material'
import Link from 'next/link'
import Permalink from './Permalink'

export default function Footer({ isHomePage }: { isHomePage?: boolean }) {
    return (
        <Grid container component="footer" mb={3} textAlign="center">
            <Grid item xs={3}>
                <Typography variant="body2">
                    {isHomePage ? <Permalink /> : <Link href="/">Back to the calculator</Link>}
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="body2">
                    <Link href="about/">How to use</Link>
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="body2">
                    <a href="https://github.com/patik/dof/issues">Feedback</a>
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="body2">
                    <a href="https://github.com/patik/dof">Tech details</a>
                </Typography>
            </Grid>
        </Grid>
    )
}
