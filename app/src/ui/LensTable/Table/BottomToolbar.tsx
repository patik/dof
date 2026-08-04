import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate'
import { Button, IconButton, Tooltip, Typography } from '@mui/material'
import MuiToolbar from '@mui/material/Toolbar'
import useDoFStore from '../../../store'
import useIsMobile from '../../../utilities/useIsMobile'
import DeleteButton from './DeleteButton'
import styles from './Table.module.css'

export default function BottomToolbar() {
    const { addLens, duplicateLenses, selected } = useDoFStore()
    const isMobile = useIsMobile()

    return (
        <MuiToolbar className={styles.toolbar} data-testid="bottom-toolbar">
            {isMobile ? null : (
                <div className={styles.toolbarSelection}>
                    {selected.length > 0 ? (
                        <>
                            <div className={styles.selectionLabel}>
                                <Typography
                                    className={styles.selectedCount}
                                    color="inherit"
                                    variant="subtitle1"
                                    component="div"
                                    data-testid="selected-count"
                                >
                                    {selected.length} selected
                                </Typography>
                            </div>
                            <div>
                                <DeleteButton lenses={selected} />
                                <Tooltip title="Duplicate">
                                    <IconButton onClick={() => duplicateLenses(selected)}>
                                        <ControlPointDuplicateIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </>
                    ) : null}
                </div>
            )}
            <div className={isMobile ? styles.mobileAction : undefined}>
                <Button onClick={() => addLens()}>Add Lens</Button>
            </div>
        </MuiToolbar>
    )
}
