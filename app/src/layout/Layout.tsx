import { Divider, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { Link } from '@tanstack/react-router'
import type { PropsWithChildren, ReactElement } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import IrisMark from '../components/ui/IrisMark'
import ThemeToggle from '../components/ui/ThemeToggle'
import Footer from './Footer'

function FallbackComponent() {
    return null
}

type Props = PropsWithChildren<{
    title?: string
    description?: string
    hasPermalink?: boolean
    noMainHeading?: boolean
}>

export default function Layout({
    title,
    description = 'Depth of field calculator and camera lens comparison tool',
    hasPermalink,
    noMainHeading,
    children,
}: Props): ReactElement {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <title>{`${title ? `${title} | ` : ''} Depth of Field Calculator & Comparison Tool for Camera Lenses`}</title>
            <meta name="description" content={description} />

            <Box
                component="main"
                sx={{ width: '100%', maxWidth: '1020px', alignSelf: 'center', px: 2, my: 3, flexGrow: 1 }}
            >
                {noMainHeading ? null : (
                    <header className="mb-8 border-b border-line pb-5">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <Link
                                to="/"
                                aria-label="Depth of Field Calculator home"
                                className="inline-flex items-center"
                            >
                                <IrisMark />
                            </Link>
                            <ThemeToggle />
                        </div>
                        <Typography variant="h4" component="h1" gutterBottom>
                            <Link to="/">Depth of Field Calculator &amp; Lens Comparison Tool</Link>
                        </Typography>
                        <Typography>Compare multiple camera lenses side-by-side</Typography>
                    </header>
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
