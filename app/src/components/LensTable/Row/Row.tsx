import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import useLensStore from '../../../store'
import { metersToFeet } from '../../../utilities/conversion'
import ApertureCell from './ApertureCell'
import FocalLengthCell from './FocalLengthCell'
import NameCell from './NameCell'
import SensorCell from './SensorCell'

export default function Row({ lens }: { lens: LensDefinition }) {
    const { units, selected, setSelected, isSelected, getRowLabelId } = useLensStore()
    const displayDof = units === 'imperial' ? metersToFeet(lens.depthOfField) : lens.depthOfField
    const isRowSelected = isSelected(lens.id)

    const onRowClick = (id: SelectedItem) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected: readonly SelectedItem[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }

        setSelected(newSelected)
    }

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
