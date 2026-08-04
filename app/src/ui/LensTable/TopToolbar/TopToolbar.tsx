import Distance from './Distance'
import UnitsToggle from './UnitsToggle'

export default function TopToolbar() {
    return (
        <section
            aria-labelledby="lenses-title"
            className="relative overflow-hidden rounded-2xl border border-line bg-panel px-4 py-5 shadow-[var(--soft-shadow)] sm:px-6 sm:py-6"
        >
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-accent" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                    <h2 id="lenses-title" className="font-display text-title leading-none font-medium text-ink">
                        Lenses
                    </h2>
                </div>
                <div className="flex min-w-0 gap-field sm:justify-end">
                    <Distance />
                    <UnitsToggle />
                </div>
            </div>
        </section>
    )
}
