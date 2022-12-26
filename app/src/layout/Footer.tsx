import { Grid, Typography } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function usePermalink(isHomePage = false): string {
    const [fullUrl, setFullUrl] = useState('')

    useEffect(() => {
        // Only relevant on the homepage
        if (!isHomePage) {
            return
        }

        const onHashChange = () => {
            setFullUrl(window.location.href)
        }

        window.addEventListener('hashchange', onHashChange)

        return () => window.removeEventListener('hashchange', onHashChange)
    })

    return fullUrl
}

export default function Footer({ isHomePage }: { isHomePage?: boolean }) {
    const fullUrl = usePermalink(isHomePage)

    return (
        <Grid container component="footer" mb={3} textAlign="center">
            <Grid item xs={4}>
                <Typography variant="body2">
                    {isHomePage ? (
                        <CopyToClipboard text={fullUrl}>
                            <a
                                href={fullUrl}
                                onClick={(e) => {
                                    // Allow opening in a new tab
                                    if (!e.metaKey) {
                                        e.preventDefault()
                                    }
                                }}
                            >
                                Link to this comparison
                            </a>
                        </CopyToClipboard>
                    ) : (
                        <Link href="/">Back to the Tool</Link>
                    )}
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
