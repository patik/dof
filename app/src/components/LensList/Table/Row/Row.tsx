import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import useDoFStore from '../../../../store'
import { metersToFeet } from '../../../../utilities/conversion'
import { getRowLabelId } from '../../../../utilities/getRowLabelId'
import Aperture from './Aperture'
import FocalLength from './FocalLength'
import Name from './Name'
import RowCheckbox from './RowCheckbox'
import Sensor from './Sensor'

export default function Row({ lens }: { lens: LensDefinition }) {
    const { units, isSelected } = useDoFStore()
    const displayDof = units === 'imperial' ? metersToFeet(lens.depthOfField) : lens.depthOfField
    const isRowSelected = isSelected(lens.id)

    return (
        <MuiTableRow
            hover
            role="checkbox"
            aria-checked={isRowSelected}
            tabIndex={-1}
            key={lens.id}
            selected={isRowSelected}
        >
            <TableCell padding="checkbox">
                <RowCheckbox lens={lens} />
            </TableCell>
            <TableCell component="th" id={getRowLabelId(lens)} scope="row" padding="none">
                <Name lens={lens} />
            </TableCell>
            <TableCell align="right">
                <FocalLength lens={lens} />
            </TableCell>
            <TableCell align="right">
                <Aperture lens={lens} />
            </TableCell>
            <TableCell align="right">
                <Sensor lens={lens} />
            </TableCell>
            <TableCell align="right" data-testid={`dof-${lens.id}`}>
                {displayDof}
            </TableCell>
        </MuiTableRow>
    )
}
