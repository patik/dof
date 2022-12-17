import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import { MouseEventHandler } from 'react'
import ApertureCell from './ApertureCell'
import FocalLengthCell from './FocalLengthCell'

export default function TableRow({
    row,
    isSelected,
    onRowClick,
}: {
    row: LensProperties
    isSelected: boolean
    onRowClick: MouseEventHandler<HTMLTableRowElement>
}) {
    const labelId = `enhanced-table-checkbox-${row.name}`

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
            <FocalLengthCell focalLength={row.focalLength} setFocalLength={() => undefined} />
            <ApertureCell aperture={row.aperture} setAperture={() => undefined} />
            <TableCell align="right">{row.sensor}</TableCell>
            <TableCell align="right">{row.depthOfField}</TableCell>
        </MuiTableRow>
    )
}
