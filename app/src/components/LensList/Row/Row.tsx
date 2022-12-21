import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import useLensDataStore from '../../../store/lensData'
import useTableStore from '../../../store/table'
import { metersToFeet } from '../../../utilities/conversion'
import ApertureCell from './ApertureCell'
import FocalLengthCell from './FocalLengthCell'
import NameCell from './NameCell'
import SensorCell from './SensorCell'

export default function Row({
    lens,
    onRowClick,
}: {
    lens: LensDefinition
    onRowClick: (id: LensDefinition['id']) => void
}) {
    const { units } = useLensDataStore()
    const { isSelected, getRowLabelId } = useTableStore()
    const displayDof = units === 'imperial' ? metersToFeet(lens.depthOfField) : lens.depthOfField
    const isRowSelected = isSelected(lens.id)

    return (
        <MuiTableRow
            hover
            role="checkbox"
            aria-checked={isRowSelected}
            tabIndex={-1}
            key={lens.name}
            selected={isRowSelected}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    onChange={() => onRowClick(lens.id)}
                    color="primary"
                    checked={isRowSelected}
                    inputProps={{
                        'aria-labelledby': getRowLabelId(lens),
                    }}
                />
            </TableCell>
            <NameCell lens={lens} />
            <FocalLengthCell lens={lens} />
            <ApertureCell lens={lens} />
            <SensorCell lens={lens} />
            <TableCell align="right">{displayDof}</TableCell>
        </MuiTableRow>
    )
}
