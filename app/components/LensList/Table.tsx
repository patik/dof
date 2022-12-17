import { Button, useMediaQuery } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import MuiTableRow from '@mui/material/TableRow'
import { Lens } from 'dof'
import { ChangeEvent, MouseEvent, useState } from 'react'
import { Header } from './Header'
import { IDGenerator } from '../../utilities/IDGenerator'
import { fullList } from './sensorList'
import TableRow from './TableRow'
import { Toolbar } from './Toolbar'

const idGenerator = new IDGenerator()

function createRowData(id: string, name: string, focalLength: number, aperture: string, sensorKey: SensorKey): Inputs {
    return {
        id,
        name,
        aperture,
        focalLength,
        sensorKey,
    }
}

function descendingComparator(a: LensProperties, b: LensProperties, orderBy: ColumnName) {
    let valueA = a[orderBy]
    let valueB = b[orderBy]

    if (typeof valueA === 'string') {
        valueA = parseFloat(valueA)
    }

    if (typeof valueB === 'string') {
        valueB = parseFloat(valueB)
    }

    if (valueB < valueA) {
        return -1
    }

    if (valueB > valueA) {
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
        createRowData(idGenerator.getNext(), 'Lens 1', 35, 'f/2', 'full'),
        createRowData(idGenerator.getNext(), 'Lens 2', 55, 'f/1.4', 'mft'),
    ])
    console.log(
        'row IDs ',
        rowData.map((r) => r.id)
    )
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<ColumnName>('id')
    const [selected, setSelected] = useState<readonly SelectedItem[]>([])
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

    const handleRequestSort = (_event: MouseEvent<unknown>, property: ColumnName) => {
        const isAsc = orderBy === property && order === 'asc'

        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rowData.map((n) => n.id)

            setSelected(newSelected)

            return
        }
        setSelected([])
    }

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

    const addRow = () => {
        setRowData([...rowData, createRowData(idGenerator.getNext(), `Lens ${rowData.length + 1}`, 35, 'f/2', 'full')])
    }

    const updateRow = (row: Inputs) => {
        const rowIndex = rowData.findIndex((r) => r.id === row.id)
        const newRows = [...rowData]

        newRows[rowIndex] = row

        setRowData(newRows)
    }

    const deleteLenses = (rowsToDelete: readonly SelectedItem[]) => {
        if (rowsToDelete.length === 0) {
            return
        }

        const remainingRows: Inputs[] = [...rowData].filter((row) => !rowsToDelete.includes(row.id))

        setRowData(remainingRows)
    }
    const duplicateLenses = (rowsToDuplicate: readonly SelectedItem[]) => {
        const newItems: Inputs[] = []

        rowsToDuplicate.forEach((id) => {
            const existingRow = rowData.find((row) => row.id === id)

            if (!existingRow) {
                console.error('Could not find row to be duplicated ', id)
                return
            }

            newItems.push(
                createRowData(
                    idGenerator.getNext(),
                    `${existingRow.name} copy`,
                    existingRow.focalLength,
                    existingRow.aperture,
                    existingRow.sensorKey
                )
            )
        })

        if (newItems.length === 0) {
            return
        }

        setRowData([...rowData, ...newItems])
    }

    const isSelected = (id: SelectedItem) => selected.indexOf(id) !== -1

    const rows: LensProperties[] = rowData.map((row) => {
        const { dof } = new Lens({
            focalLength: row.focalLength,
            aperture: row.aperture,
            cropFactor: fullList[row.sensorKey].value,
            id: row.id,
        })

        return {
            ...row,
            depthOfField: rounded(dof(distance).dof),
        }
    })

    return (
        <Paper sx={{ width: '100%', maxWidth: isDesktop ? 960 : undefined, mb: 2 }}>
            <Toolbar selected={selected} deleteLenses={deleteLenses} duplicateLenses={duplicateLenses} />
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
                                    isSelected={isSelected(row.id)}
                                    onRowClick={onRowClick}
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
