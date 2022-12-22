import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import MuiToolbar from '@mui/material/Toolbar'
import useDoFStore from '../../store'

export function BottomToolbar() {
    const { addLens, deleteLenses, duplicateLenses, selected } = useDoFStore()

    return (
        <MuiToolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Box flexGrow={1} display="flex" alignItems="center">
                <Box mr={1}>
                    {selected.length > 0 ? (
                        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                            {selected.length} selected
                        </Typography>
                    ) : null}
                </Box>
                <Box>
                    {selected.length > 0 ? (
                        <>
                            <Tooltip title="Delete">
                                <IconButton onClick={() => deleteLenses(selected)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Duplicate">
                                <IconButton onClick={() => duplicateLenses(selected)}>
                                    <ControlPointDuplicateIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : null}
                </Box>
            </Box>
            <Box>
                <Button onClick={() => addLens()}>Add Lens</Button>
            </Box>
        </MuiToolbar>
    )
}
