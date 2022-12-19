import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import ApertureCell from './ApertureCell'
import FocalLengthCell from './FocalLengthCell'
import SensorCell from './SensorCell'

export default function TableRow({
    row,
    isSelected,
    onRowClick,
    updateLens,
}: {
    row: LensDefinition
    isSelected: boolean
    onRowClick: (id: LensDefinition['id']) => void
    updateLens: (lens: LensDefinition) => void
}) {
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
            <TableCell component="th" id={labelId} scope="row" padding="none">
                {row.name}
            </TableCell>
            <FocalLengthCell focalLength={row.focalLength} setFocalLength={setFocalLength} />
            <ApertureCell aperture={row.aperture} setAperture={setAperture} />
            <SensorCell sensorKey={row.sensorKey} setSensorKey={setSensorKey} />
            <TableCell align="right">{row.depthOfField}</TableCell>
        </MuiTableRow>
    )
}
