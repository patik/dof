import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import { MouseEventHandler } from 'react'
import ApertureCell from './ApertureCell'
import FocalLengthCell from './FocalLengthCell'
import SensorCell from './SensorCell'

export default function TableRow({
    row,
    isSelected,
    onRowClick,
    updateRow,
}: {
    row: LensProperties
    isSelected: boolean
    onRowClick: MouseEventHandler<HTMLTableRowElement>
    updateRow: (row: Inputs) => void
}) {
    const labelId = `enhanced-table-checkbox-${row.name}`
    const setAperture = (aperture: LensProperties['aperture']) => {
        updateRow({ ...row, aperture })
    }
    const setFocalLength = (focalLength: LensProperties['focalLength']) => {
        updateRow({ ...row, focalLength })
    }
    const setSensorKey = (sensorKey: LensProperties['sensorKey']) => {
        updateRow({ ...row, sensorKey })
    }

    return (
        <MuiTableRow
            hover
            onClick={onRowClick}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={-1}
            key={row.name}
            selected={isSelected}
        >
            <TableCell padding="checkbox">
                <Checkbox
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
