import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider as MuiThemeProvider, responsiveFontSizes } from '@mui/material/styles'
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type ColorTheme = 'light' | 'dark'

type ThemeContextValue = {
    theme: ColorTheme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const displayTypography = {
    fontFamily: "'Newsreader Variable', serif",
    fontWeight: 500,
}

function getInitialTheme(): ColorTheme {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function getStoredTheme(): ColorTheme | null {
    try {
        const storedTheme = localStorage.getItem('dof-theme')
        return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null
    } catch {
        return null
    }
}

export function ThemeProvider({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState<ColorTheme>(getInitialTheme)
    const [hasManualOverride, setHasManualOverride] = useState(() => getStoredTheme() !== null)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        document.documentElement.style.colorScheme = theme
    }, [theme])

    useEffect(() => {
        if (hasManualOverride) {
            return
        }

        const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
        const followSystemTheme = () => {
            setTheme(colorScheme.matches ? 'dark' : 'light')
        }

        followSystemTheme()
        colorScheme.addEventListener('change', followSystemTheme)
        return () => colorScheme.removeEventListener('change', followSystemTheme)
    }, [hasManualOverride])

    const toggleTheme = useCallback(() => {
        const nextTheme = theme === 'light' ? 'dark' : 'light'

        setHasManualOverride(true)
        setTheme(nextTheme)
        try {
            localStorage.setItem('dof-theme', nextTheme)
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
                        h1: displayTypography,
                        h2: {
                            ...displayTypography,
                            fontSize: '2rem',
                            lineHeight: 1.2,
                        },
                        h3: {
                            ...displayTypography,
                            fontSize: '1.5rem',
                            lineHeight: 1.3,
                        },
                        h4: displayTypography,
                        h5: displayTypography,
                        h6: displayTypography,
                    },
                }),
            ),
        [theme],
    )

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
        }),
        [theme, toggleTheme],
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
