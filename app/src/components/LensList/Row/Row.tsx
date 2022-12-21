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
    const { units } = useStore()
    const labelId = `enhanced-table-checkbox-${row.name}`

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
            <NameCell id={row.id} labelId={labelId} />
            <FocalLengthCell id={row.id} />
            <ApertureCell id={row.id} />
            <SensorCell id={row.id} />
            <TableCell align="right">{dof}</TableCell>
        </MuiTableRow>
    )
}
