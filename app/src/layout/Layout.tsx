import { Typography } from '@mui/material'
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
        <div className="flex min-h-full flex-col">
            <title>{`${title ? `${title} | ` : ''} Depth of Field Calculator & Comparison Tool for Camera Lenses`}</title>
            <meta name="description" content={description} />

            <main className="my-6 w-full max-w-[1020px] grow self-center px-4">
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

                <hr className="my-4 border-0 border-t border-line" />

                <ErrorBoundary FallbackComponent={FallbackComponent}>
                    <Footer hasPermalink={hasPermalink} />
                </ErrorBoundary>
            </main>
        </div>
    )
}
