import DeleteIcon from '@mui/icons-material/Delete'
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { alpha } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { visuallyHidden } from '@mui/utils'
import React, { ChangeEvent, MouseEvent, useState } from 'react'

interface Data {
    name: string
    focalLength: number
    aperture: string
    sensor: number
    depthOfField: number
}

type ColumnName = keyof Data

interface HeadCell {
    disablePadding: boolean
    id: ColumnName
    label: string
    numeric: boolean
}

type Order = 'asc' | 'desc'

function createData(name: string, focalLength: number, aperture: string, sensor: number, depthOfField: number): Data {
    return {
        name,
        aperture,
        focalLength,
        sensor,
        depthOfField,
    }
}

function descendingComparator(a: Data, b: Data, orderBy: keyof Data) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator<Key extends ColumnName>(order: Order, orderBy: Key): (a: Data, b: Data) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'aperture',
        numeric: true,
        disablePadding: false,
        label: 'Aperture',
    },
    {
        id: 'focalLength',
        numeric: true,
        disablePadding: false,
        label: 'Focal Length',
    },
    {
        id: 'sensor',
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

interface EnhancedTableProps {
    units: Units
    numSelected: number
    onRequestSort: (event: React.MouseEvent<unknown>, property: ColumnName) => void
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
    order: Order
    orderBy: string
    rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, units } = props
    const createSortHandler = (property: ColumnName) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all lenses',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
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

interface EnhancedTableToolbarProps {
    selected: readonly Data['name'][]
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { selected } = props

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(selected.length > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {selected.length > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {selected.length} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Lenses
                </Typography>
            )}
            {selected.length > 0 ? (
                <>
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Duplicate">
                        <IconButton>
                            <ControlPointDuplicateIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    )
}

export default function LensList({ units }: { units: Units }) {
    const [rows, setRows] = useState<Data[]>([
        createData('Lens 1', 35, 'f/2', 1, 4.3),
        createData('Lens 2', 55, 'f/1.4', 2, 16),
    ])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<ColumnName>('depthOfField')
    const [selected, setSelected] = useState<readonly Data['name'][]>([])

    const handleRequestSort = (_event: MouseEvent<unknown>, property: ColumnName) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (_event: React.MouseEvent<unknown>, name: Data['name']) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected: readonly Data['name'][] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }

        setSelected(newSelected)
    }

    const addRow = () => {
        setRows([...rows, createData(`Lens ${rows.length + 1}`, 35, 'f/2', 1, 4)])
    }

    const isSelected = (name: Data['name']) => selected.indexOf(name) !== -1

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar selected={selected} />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                        <EnhancedTableHead
                            units={units}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows.sort(getComparator(order, orderBy)).map((row, index) => {
                                const isItemSelected = isSelected(row.name)
                                const labelId = `enhanced-table-checkbox-${index}`

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.name)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.name}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" id={labelId} scope="row" padding="none">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.focalLength}</TableCell>
                                        <TableCell align="right">{row.aperture}</TableCell>
                                        <TableCell align="right">{row.sensor}</TableCell>
                                        <TableCell align="right">{row.depthOfField}</TableCell>
                                    </TableRow>
                                )
                            })}
                            <TableRow
                                style={{
                                    height: 53,
                                }}
                            >
                                <TableCell colSpan={6} align="center">
                                    <Button onClick={() => addRow()}>Add Lens</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}
