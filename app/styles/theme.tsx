import { CssBaseline, useMediaQuery } from '@mui/material'
import { createTheme, responsiveFontSizes, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { PropsWithChildren, useMemo } from 'react'

export function ThemeProvider({ children }: PropsWithChildren) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const theme = useMemo(
        () =>
            responsiveFontSizes(
                createTheme({
                    palette: {
                        mode: prefersDarkMode ? 'dark' : 'light',
                    },
                    typography: {
                        body1: {
                            fontFamily:
                                "'Open Sans', -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                        },
                        fontSize: 16,
                        h1: {
                            fontSize: '2rem',
                        },
                        h2: {
                            fontSize: '1.75rem',
                        },
                        subtitle1: {
                            // fontSize: 12,
                        },
                        button: {
                            // fontStyle: 'italic',
                        },
                    },
                })
            ),
        [prefersDarkMode]
    )

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    )
}
