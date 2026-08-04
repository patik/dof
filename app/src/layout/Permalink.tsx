import CloseIcon from '@mui/icons-material/Close'
import { Portal } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import { useEffect, useState } from 'react'

function usePermalink(): string {
    const [fullUrl, setFullUrl] = useState('')

    useEffect(() => {
        const onHashChange = () => {
            setFullUrl(window.location.href)
        }

        window.addEventListener('hashchange', onHashChange)

        return () => window.removeEventListener('hashchange', onHashChange)
    })

    return fullUrl
}

export default function Permalink() {
    const fullUrl = usePermalink()

    const [open, setOpen] = useState(false)

    const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !navigator.clipboard?.writeText) {
            return
        }

        event.preventDefault()

        try {
            await navigator.clipboard.writeText(fullUrl)
            setOpen(true)
        } catch {
            setOpen(false)
            window.location.assign(fullUrl)
        }
    }

    const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    const action = (
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
        </IconButton>
    )

    return (
        <>
            <a href={fullUrl} onClick={handleClick}>
                Link to this comparison
            </a>
            {/* Use Portal to prevent this <div> from being a descendant of the <p> that holds this link */}
            <Portal>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    message="Copied to clipboard"
                    action={action}
                />
            </Portal>
        </>
    )
}
