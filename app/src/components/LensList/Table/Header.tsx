import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import { ChangeEvent, useMemo } from 'react'
import useDoFStore from '../../../store'

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'focalLength',
        numeric: true,
        disablePadding: false,
        label: 'Focal Length',
    },
    {
        id: 'aperture',
        numeric: true,
        disablePadding: false,
        label: 'Aperture',
    },
    {
        id: 'sensorKey',
        numeric: true,
        disablePadding: false,
        label: 'Sensor',
    },
    {
        id: 'depthOfField',
        numeric: true,
        disablePadding: false,
        label: 'Depth of Field',
    },
]

export default function Header() {
    const { units, lenses, order, orderBy, selected, setSelected, setSorting } = useDoFStore()
    const numSelected = selected.length
    const rowCount = lenses.length
    const handleSelectAllClick = useMemo(
        () => (event: ChangeEvent<HTMLInputElement>) => {
            console.log('select All clicked ', event.target.checked, event.target)
            if (event.target.checked) {
                const newSelected = lenses.map((n) => n.id)

                setSelected(newSelected)

                console.log('select All clicked A', newSelected.length)
                return
            }

            console.log('select All clicked B')
            setSelected([])
        },
        [lenses, setSelected]
    )
    const createSortHandler = (col: ColumnName) => () => {
        setSorting(col)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={handleSelectAllClick}
                        inputProps={{
                            'aria-label': 'Select all lenses',
                        }}
                        data-testid="select-all"
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        size="small"
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {`${headCell.label}${
                                headCell.id === 'depthOfField' ? ` (${units === 'imperial' ? 'feet' : 'meters'})` : ''
                            }`}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}