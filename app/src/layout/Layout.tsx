import { ErrorBoundary } from 'react-error-boundary'
import Footer from './Footer'
import Box from '@mui/material/Box'
import Head from 'next/head'
import { PropsWithChildren, ReactElement } from 'react'
import { Typography } from '@mui/material'
import Link from 'next/link'

function FallbackComponent() {
    return <></>
}

type Props = PropsWithChildren<{
    title?: string
    isHomePage?: boolean
}>

export default function Layout({ title, isHomePage, children }: Props): ReactElement {
    return (
        <Box display="flex" flexDirection="column" minHeight="100%">
            <Head>
                <title>{`${
                    title ? `${title} | ` : ''
                } Depth of Field Calculator &amp; Comparison Tool for Camera Lenses`}</title>
            </Head>

            <Box width="100%" maxWidth="1020px" alignSelf="center" component="main" px={2} my={3} flexGrow={1}>
                <Box mb={3}>
                    <Typography variant="h1" gutterBottom>
                        <Link href="/">Depth of Field Calculator &amp; Lens Comparison Tool</Link>
                    </Typography>
                    <Typography>Compare multiple camera lenses side-by-side</Typography>
                </Box>
                <ErrorBoundary FallbackComponent={FallbackComponent}>{children}</ErrorBoundary>
            </Box>

            <ErrorBoundary FallbackComponent={FallbackComponent}>
                <Footer isHomePage={isHomePage} />
            </ErrorBoundary>
        </Box>
    )
}
