import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider as MuiThemeProvider, responsiveFontSizes } from '@mui/material/styles'
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

type ColorTheme = 'light' | 'dark'

type ThemeContextValue = {
    theme: ColorTheme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): ColorTheme {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState<ColorTheme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        document.documentElement.style.colorScheme = theme

        try {
            localStorage.setItem('dof-theme', theme)
        } catch {
            // Browsers can deny storage access; the in-memory theme still works.
        }
    }, [theme])

    const muiTheme = useMemo(
        () =>
            responsiveFontSizes(
                createTheme({
                    palette: {
                        mode: theme,
                        primary: {
                            main: theme === 'dark' ? '#f6b85d' : '#a64917',
                        },
                        background: {
                            default: theme === 'dark' ? '#171512' : '#f6f1e8',
                            paper: theme === 'dark' ? '#211e1a' : '#fffaf2',
                        },
                    },
                    typography: {
                        fontFamily: "'Archivo Variable', sans-serif",
                        fontSize: 16,
                    },
                }),
            ),
        [theme],
    )

    const value = useMemo(
        () => ({
            theme,
            toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
        }),
        [theme],
    )

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}

export function useColorTheme(): ThemeContextValue {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useColorTheme must be used within ThemeProvider')
    }

    return context
}
