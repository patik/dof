import { Button, useMediaQuery } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { ChangeEvent, MouseEvent, useState } from 'react'
import { Header } from './Header'
import Row from './Row/Row'
import { Toolbar } from './Toolbar'

function descendingComparator(a: LensDefinition, b: LensDefinition, orderBy: ColumnName) {
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
): (a: LensDefinition, b: LensDefinition) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

export default function LensList({
    units,
    lenses,
    addLens,
    updateLens,
    deleteLenses,
    duplicateLenses,
}: {
    units: Units
    lenses: LensDefinition[]
    addLens: () => void
    updateLens: (lens: LensDefinition) => void
    duplicateLenses: (lensesToDuplicate: readonly SelectedItem[]) => void
    deleteLenses: (lensesToDelete: readonly SelectedItem[]) => void
}) {
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
            const newSelected = lenses.map((n) => n.id)

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

    const isSelected = (id: SelectedItem) => selected.indexOf(id) !== -1

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
                        rowCount={lenses.length}
                    />
                    <TableBody>
                        {lenses.sort(getComparator(order, orderBy)).map((row) => (
                            <Row
                                key={row.name}
                                row={row}
                                isSelected={isSelected(row.id)}
                                onRowClick={onRowClick}
                                updateLens={updateLens}
                            />
                        ))}
                        <TableRow
                            style={{
                                height: 53,
                            }}
                        >
                            <TableCell colSpan={6} align="center">
                                <Button onClick={() => addLens()}>Add Lens</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
