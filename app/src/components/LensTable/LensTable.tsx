import { Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import useDoFStore from '../../store'
import { Header } from './Header'
import Row from './Row/Row'
import { Toolbar } from './Toolbar'

function removeAperturePrefix(value: LensDefinition['aperture']) {
    return value.replace(/^f\//, '')
}

function descendingComparator(a: LensDefinition, b: LensDefinition, orderBy: ColumnName) {
    let valueA = a[orderBy]
    let valueB = b[orderBy]

    if (typeof valueA === 'string') {
        valueA = parseFloat(removeAperturePrefix(valueA))
    }

    if (typeof valueB === 'string') {
        valueB = parseFloat(removeAperturePrefix(valueB))
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

export default function LensTable() {
    const { lenses, addLens, order, orderBy } = useDoFStore()

    return (
        <Paper sx={{ width: '100%', maxWidth: '960px', mb: 2 }}>
            <Toolbar />
            <TableContainer>
                <Table aria-labelledby="tableTitle" size="small">
                    <Header />
                    <TableBody>
                        {lenses.sort(getComparator(order, orderBy)).map((row) => (
                            <Row key={row.id} lens={row} />
                        ))}
                        <TableRow>
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
