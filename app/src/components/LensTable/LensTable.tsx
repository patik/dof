import { Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { useEffect } from 'react'
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

    useEffect(
        () => {
            if (lenses.length > 0) {
                return
            }

            // Populate an empty table with some data
            addLens({
                focalLength: 35,
                aperture: 'f/2',
                sensorKey: 'full',
            })

            // This useEffect will run twice on dev, creating four lenses, so shortcircuit it to prevent tht
            if (process.env.NODE_ENV !== 'development') {
                return
            }

            addLens({
                focalLength: 55,
                aperture: 'f/1.4',
                sensorKey: 'mft',
            })
        },
        // Only run on first mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

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
