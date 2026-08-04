import { useColorTheme } from '../../styles/theme'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useColorTheme()
    const nextTheme = theme === 'light' ? 'dark' : 'light'

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-3 text-sm font-medium text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent-strong"
            aria-label={`Use ${nextTheme} theme`}
            title={`Use ${nextTheme} theme`}
        >
            <span aria-hidden="true" className="relative grid size-4 place-items-center">
                <span className="absolute size-3 rounded-full border-2 border-current" />
                <span
                    className={`absolute size-1.5 rounded-full bg-current transition-transform ${theme === 'dark' ? 'translate-x-1' : '-translate-x-1'}`}
                />
            </span>
            <span className="hidden sm:inline">{theme === 'light' ? 'Light' : 'Dark'}</span>
        </button>
    )
}
