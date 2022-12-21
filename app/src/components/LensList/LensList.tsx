import { Button, useMediaQuery } from '@mui/material'
import Paper from '@mui/material/Paper'
import { Theme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import useLensDataStore from '../../store/lensData'
import useTableStore from '../../store/table'
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

export default function LensList() {
    const { order, orderBy } = useTableStore()
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'))
    const { lenses, addLens } = useLensDataStore()

    return (
        <Paper sx={{ width: '100%', maxWidth: isDesktop ? 960 : undefined, mb: 2 }}>
            <Toolbar />
            <TableContainer>
                <Table aria-labelledby="tableTitle" size="medium">
                    <Header />
                    <TableBody>
                        {lenses.sort(getComparator(order, orderBy)).map((row) => (
                            <Row key={row.id} lens={row} />
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
