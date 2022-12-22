import { Button, TableCell } from '@mui/material'
import MuiToolbar from '@mui/material/Toolbar'
import useDoFStore from '../../store'

export function BottomToolbar() {
    const { addLens } = useDoFStore()

    return (
        <MuiToolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <TableCell colSpan={6} align="center">
                <Button onClick={() => addLens()}>Add Lens</Button>
            </TableCell>
        </MuiToolbar>
    )
}
