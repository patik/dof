import { Button, useMediaQuery } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import MuiTableRow from '@mui/material/TableRow'
import { Lens } from 'dof'
import React, { ChangeEvent, MouseEvent, useState } from 'react'
import { Header } from './Header'
import TableRow from './TableRow'
import { Toolbar } from './Toolbar'
import { v4 as uuid } from 'uuid'

function createRowData(name: string, focalLength: number, aperture: string, sensor: number): Inputs {
    return {
        id: uuid(),
        name,
        aperture,
        focalLength,
        sensor,
    }
}

function descendingComparator(a: LensProperties, b: LensProperties, orderBy: ColumnName) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }

    if (b[orderBy] > a[orderBy]) {
        return 1
    }

    return 0
}

function getComparator<Key extends ColumnName>(
    order: Order,
    orderBy: Key
): (a: LensProperties, b: LensProperties) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function rounded(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

export default function LensList({ units, distance }: { units: Units; distance: number }) {
    const [rowData, setRowData] = useState<Inputs[]>([
        createRowData('Lens 1', 35, 'f/2', 1),
        createRowData('Lens 2', 55, 'f/1.4', 2),
    ])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<ColumnName>('depthOfField')
    const [selected, setSelected] = useState<readonly LensProperties['name'][]>([])
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

    const handleRequestSort = (_event: MouseEvent<unknown>, property: ColumnName) => {
        const isAsc = orderBy === property && order === 'asc'

        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rowData.map((n) => n.name)

            setSelected(newSelected)

            return
        }
        setSelected([])
    }

    const onRowClick = (_event: React.MouseEvent<unknown>, name: LensProperties['name']) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected: readonly LensProperties['name'][] = []

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
        setRowData([...rowData, createRowData(`Lens ${rowData.length + 1}`, 35, 'f/2', 1)])
    }

    const updateRow = (row: Inputs) => {
        const rowIndex = rowData.findIndex((r) => r.id === row.id)
        const newRows = [...rowData]

        newRows[rowIndex] = row

        setRowData(newRows)
    }

    const isSelected = (name: LensProperties['name']) => selected.indexOf(name) !== -1

    const rows: LensProperties[] = rowData.map((row) => {
        const { dof } = new Lens({ ...row, distance })

        return {
            ...row,
            depthOfField: rounded(dof(distance).dof),
        }
    })

    return (
        <Paper sx={{ width: '100%', maxWidth: isDesktop ? 960 : undefined, mb: 2 }}>
            <Toolbar selected={selected} />
            <TableContainer>
                <Table aria-labelledby="tableTitle" size="medium">
                    <Header
                        units={units}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rowData.length}
                    />
                    <TableBody>
                        {rows.sort(getComparator(order, orderBy)).map((row) => {
                            return (
                                <TableRow
                                    key={row.name}
                                    row={row}
                                    isSelected={isSelected(row.name)}
                                    onRowClick={(event) => onRowClick(event, row.name)}
                                    updateRow={updateRow}
                                />
                            )
                        })}
                        <MuiTableRow
                            style={{
                                height: 53,
                            }}
                        >
                            <TableCell colSpan={6} align="center">
                                <Button onClick={() => addRow()}>Add Lens</Button>
                            </TableCell>
                        </MuiTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
