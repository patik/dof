import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '../styles/theme'

export const Route = createRootRoute({
    component: Root,
    notFoundComponent: NotFound,
})

function Root() {
    return (
        <ThemeProvider>
            <Outlet />
        </ThemeProvider>
    )
}

function NotFound() {
    return (
        <main>
            <title>Page not found | Depth of Field Calculator</title>
            <h1>Page not found</h1>
            <p>The page you requested does not exist.</p>
        </main>
    )
}
