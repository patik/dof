import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import useStore from '../../../store/store'
import { metersToFeet } from '../../../utilities/conversion'
import ApertureCell from './ApertureCell'
import FocalLengthCell from './FocalLengthCell'
import NameCell from './NameCell'
import SensorCell from './SensorCell'

export default function Row({
    row,
    isSelected,
    onRowClick,
}: {
    row: LensDefinition
    isSelected: boolean
    onRowClick: (id: LensDefinition['id']) => void
}) {
    const { units, updateLens } = useStore()
    const labelId = `enhanced-table-checkbox-${row.name}`
    const setAperture = (aperture: LensDefinition['aperture']) => {
        updateLens({ ...row, aperture })
    }
    const setFocalLength = (focalLength: LensDefinition['focalLength']) => {
        updateLens({ ...row, focalLength })
    }
    const setSensorKey = (sensorKey: LensDefinition['sensorKey']) => {
        updateLens({ ...row, sensorKey })
    }
    const setName = (name: LensDefinition['name']) => {
        updateLens({ ...row, name })
    }

    const dof = units === 'imperial' ? metersToFeet(row.depthOfField) : row.depthOfField

    return (
        <MuiTableRow hover role="checkbox" aria-checked={isSelected} tabIndex={-1} key={row.name} selected={isSelected}>
            <TableCell padding="checkbox">
                <Checkbox
                    onChange={() => onRowClick(row.id)}
                    color="primary"
                    checked={isSelected}
                    inputProps={{
                        'aria-labelledby': labelId,
                    }}
                />
            </TableCell>
            <NameCell name={row.name} setName={setName} labelId={labelId} />
            <FocalLengthCell focalLength={row.focalLength} setFocalLength={setFocalLength} />
            <ApertureCell aperture={row.aperture} setAperture={setAperture} />
            <SensorCell sensorKey={row.sensorKey} setSensorKey={setSensorKey} />
            <TableCell align="right">{dof}</TableCell>
        </MuiTableRow>
    )
}
