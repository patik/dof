import { Toggle } from '@base-ui/react/toggle'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import useDoFStore from '../../../store'

export default function UnitsToggle() {
    const { units, setUnits } = useDoFStore()

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-64">
            <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">
                Measurement system
            </span>
            <ToggleGroup
                value={[units]}
                onValueChange={(values) => {
                    const nextUnits = values[0]

                    if (nextUnits === 'metric' || nextUnits === 'imperial') {
                        setUnits(nextUnits)
                    }
                }}
                aria-label="Units"
                className="grid h-12 grid-cols-2 rounded-xl border border-line bg-panel-raised p-1 shadow-sm"
            >
                <Toggle
                    value="metric"
                    title="Meters"
                    render={(props) => <button {...props} value="metric" />}
                    className="rounded-lg px-3 text-sm font-semibold text-muted transition hover:text-ink data-[pressed]:bg-accent-strong data-[pressed]:text-accent-ink data-[pressed]:shadow-sm"
                >
                    Metric
                </Toggle>
                <Toggle
                    value="imperial"
                    title="Feet"
                    render={(props) => <button {...props} value="imperial" />}
                    className="rounded-lg px-3 text-sm font-semibold text-muted transition hover:text-ink data-[pressed]:bg-accent-strong data-[pressed]:text-accent-ink data-[pressed]:shadow-sm"
                >
                    Imperial
                </Toggle>
            </ToggleGroup>
        </div>
    )
}
