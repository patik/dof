import { Box, Typography } from '@mui/material'
import Head from 'next/head'
import Main from '../components/Main'

export default function Home() {
    return (
        <Box>
            <Head>
                <title>Depth of Field Calculator &amp; Comparison Tool for Camera Lenses</title>
            </Head>

            <Box role="main">
                <Typography variant="h1">
                    <a href="http://patik.com/dof/">Depth of Field Calculator &amp; Comparison Tool</a>
                </Typography>

                <p>Compare multiple camera lenses side-by-side</p>

                <Main />
            </Box>

            <Box role="footer" display="flex">
                <Box>
                    <p>
                        <a href="#" className="comparison-link">
                            Link to this comparison
                        </a>
                    </p>
                </Box>
                <Box>
                    <p>
                        <a href="about/">About this tool</a>
                    </p>
                </Box>
                <Box>
                    <p>
                        <a href="https://github.com/patik/dof">View on GitHub</a>
                    </p>
                </Box>
            </Box>
        </Box>
    )
}
