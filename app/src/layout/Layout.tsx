import { Divider, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { Link } from '@tanstack/react-router'
import type { PropsWithChildren, ReactElement } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Footer from './Footer'

function FallbackComponent() {
    return null
}

type Props = PropsWithChildren<{
    title?: string
    hasPermalink?: boolean
    noMainHeading?: boolean
}>

export default function Layout({ title, hasPermalink, noMainHeading, children }: Props): ReactElement {
    return (
        <Box display="flex" flexDirection="column" minHeight="100%">
            <title>{`${title ? `${title} | ` : ''} Depth of Field Calculator & Comparison Tool for Camera Lenses`}</title>
            <meta name="description" content="Depth of field calculator and camera lens comparison tool" />

            <Box width="100%" maxWidth="1020px" alignSelf="center" component="main" px={2} my={3} flexGrow={1}>
                {noMainHeading ? null : (
                    <Box mb={3}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            <Link to="/">Depth of Field Calculator &amp; Lens Comparison Tool</Link>
                        </Typography>
                        <Typography>Compare multiple camera lenses side-by-side</Typography>
                    </Box>
                )}

                <ErrorBoundary FallbackComponent={FallbackComponent}>{children}</ErrorBoundary>

                <Divider sx={{ my: 2 }} />

                <ErrorBoundary FallbackComponent={FallbackComponent}>
                    <Footer hasPermalink={hasPermalink} />
                </ErrorBoundary>
            </Box>
        </Box>
    )
}
