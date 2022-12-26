import { Grid, Typography } from '@mui/material'
import Link from 'next/link'
import Permalink from '../components/Permalink'

export default function Footer({ isHomePage }: { isHomePage?: boolean }) {
    return (
        <Grid container component="footer" mb={3} textAlign="center">
            <Grid item xs={4}>
                <Typography variant="body2">
                    {isHomePage ? <Permalink /> : <Link href="/">Back to the Tool</Link>}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">
                    <Link href="about/">About this tool</Link>
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">
                    <a href="https://github.com/patik/dof">View on GitHub</a>
                </Typography>
            </Grid>
        </Grid>
    )
}
