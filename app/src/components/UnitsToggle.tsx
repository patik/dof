import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import useLensStore from '../store'

function UnitsToggleButton({
    onChange,
}: {
    onChange: (_event: React.MouseEvent<HTMLElement>, newAlignment: Units | null) => void
}) {
    const { units } = useLensStore()

    return (
        <ToggleButtonGroup exclusive color="primary" value={units} onChange={onChange} aria-label="Units">
            <ToggleButton value="metric">Metric (meters)</ToggleButton>
            <ToggleButton value="imperial">Imperial (feet)</ToggleButton>
        </ToggleButtonGroup>
    )
}

export default function UnitsToggle() {
    const { setUnits } = useLensStore()

    const handleUnitsChange = (_event: React.MouseEvent<HTMLElement>, newUnits: Units | null) => {
        if (newUnits !== null) {
            setUnits(newUnits)
        }
    }

    return <UnitsToggleButton onChange={handleUnitsChange} />
}
