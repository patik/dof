import { Input } from '@base-ui/react/input'
import useDoFStore from '../../../store'

export default function Distance() {
    const { units, distance, setDistance } = useDoFStore()

    return (
        <div data-testid="distance" className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-48">
            <label
                htmlFor="subject-distance"
                className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase"
            >
                Subject distance
            </label>
            <div className="flex h-12 items-center overflow-hidden rounded-xl border border-line bg-panel-raised shadow-sm transition focus-within:border-accent">
                <Input
                    id="subject-distance"
                    type="number"
                    min="0.1"
                    step="0.1"
                    inputMode="decimal"
                    autoComplete="off"
                    aria-label="Distance"
                    value={distance}
                    onChange={(event) => {
                        const nextDistance = Number.parseFloat(event.target.value)

                        if (nextDistance > 0) {
                            setDistance(nextDistance)
                        }
                    }}
                    className="tabular-nums min-w-0 flex-1 border-0 bg-transparent px-4 text-lg font-semibold text-ink outline-none"
                />
                <span className="border-l border-line px-3 text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                    {units === 'metric' ? 'm' : 'ft'}
                </span>
            </div>
        </div>
    )
}
