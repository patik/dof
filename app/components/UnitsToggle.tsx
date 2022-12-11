import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

function UnitsToggleButton({
    units,
    onChange,
}: {
    units: Units
    onChange: (_event: React.MouseEvent<HTMLElement>, newAlignment: Units | null) => void
}) {
    return (
        <ToggleButtonGroup exclusive color="primary" value={units} onChange={onChange} aria-label="Units">
            <ToggleButton value="metric">Metric (meters)</ToggleButton>
            <ToggleButton value="imperial">Imperial (feet)</ToggleButton>
        </ToggleButtonGroup>
    )
}

export default function UnitsToggle({ units, setUnits }: { units: Units; setUnits: Dispatch<SetStateAction<Units>> }) {
    const handleUnitsChange = (_event: React.MouseEvent<HTMLElement>, newUnits: Units | null) => {
        if (newUnits !== null) {
            setUnits(newUnits)
        }
    }

    return <UnitsToggleButton units={units} onChange={handleUnitsChange} />
}
