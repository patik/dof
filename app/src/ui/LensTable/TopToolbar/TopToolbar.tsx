import Distance from './Distance'
import UnitsToggle from './UnitsToggle'

export default function TopToolbar() {
    return (
        <section
            aria-labelledby="lens-workbench-title"
            className="relative overflow-hidden rounded-2xl border border-line bg-panel px-4 py-5 shadow-[var(--soft-shadow)] sm:px-6 sm:py-6"
        >
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-accent" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[0.68rem] font-semibold tracking-[0.18em] text-accent-strong uppercase">
                        Focus plane 01
                    </p>
                    <h2
                        id="lens-workbench-title"
                        className="font-display text-3xl leading-none font-medium text-ink sm:text-4xl"
                    >
                        Lens workbench
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                        Set the subject distance, then compare optical behavior across your kit.
                    </p>
                </div>
                <div className="flex min-w-0 gap-3 sm:justify-end">
                    <Distance />
                    <UnitsToggle />
                </div>
            </div>
        </section>
    )
}
