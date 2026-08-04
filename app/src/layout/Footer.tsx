import { Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import Permalink from './Permalink'

export default function Footer({ hasPermalink }: { hasPermalink?: boolean }) {
    return (
        <footer className="mb-6 grid grid-cols-4 text-center">
            <div>
                <Typography variant="body2">
                    {hasPermalink ? <Permalink /> : <Link to="/">Back to the calculator</Link>}
                </Typography>
            </div>
            <div>
                <Typography variant="body2">
                    <Link to="/about">How to use</Link>
                </Typography>
            </div>
            <div>
                <Typography variant="body2">
                    <a href="https://github.com/patik/dof/issues">Feedback</a>
                </Typography>
            </div>
            <div>
                <Typography variant="body2">
                    <Link to="/software">Tech & software details</Link>
                </Typography>
            </div>
        </footer>
    )
}
