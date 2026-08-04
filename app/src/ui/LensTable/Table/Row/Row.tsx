import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { IconButton, Typography } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import { useState } from 'react'
import useDoFStore from '../../../../store'
import { metersToFeet, rounded } from '../../../../utilities/conversion'
import { getRowLabelId } from '../../../../utilities/getRowLabelId'
import useIsMobile from '../../../../utilities/useIsMobile'
import DeleteButton from '../DeleteButton'
import styles from '../Table.module.css'
import Aperture from './Aperture'
import DepthOfFieldDetails from './DepthOfFieldDetails'
import FocalLength from './FocalLength'
import Name from './Name'
import RowCheckbox from './RowCheckbox'
import Sensor from './Sensor'

export default function Row({ lens }: { lens: LensDefinition }) {
    const isMobile = useIsMobile()
    const { units, isSelected } = useDoFStore()
    const displayDof = units === 'imperial' ? metersToFeet(lens.depthOfField.dof) : rounded(lens.depthOfField.dof)
    const isRowSelected = isSelected(lens.id)
    const [open, setOpen] = useState(false)

    return (
        <>
            <MuiTableRow
                hover
                key={lens.id}
                selected={isRowSelected}
                className={isMobile ? `lens-table-row ${styles.mobileRow}` : 'lens-table-row'}
                data-testid={`lens-table-row-${lens.id}`}
            >
                {isMobile ? null : (
                    <TableCell padding="checkbox">
                        <RowCheckbox lens={lens} />
                    </TableCell>
                )}
                <TableCell
                    component="th"
                    id={getRowLabelId(lens)}
                    scope="row"
                    padding="none"
                    className={isMobile ? `${styles.mobileCell} ${styles.nameCell}` : undefined}
                >
                    <Name lens={lens} />
                </TableCell>
                <TableCell
                    align={isMobile ? undefined : 'right'}
                    className={isMobile ? `${styles.mobileCell} ${styles.focalLengthCell}` : undefined}
                >
                    <FocalLength lens={lens} />
                </TableCell>
                <TableCell
                    align={isMobile ? undefined : 'right'}
                    className={isMobile ? `${styles.mobileCell} ${styles.apertureCell}` : undefined}
                >
                    <Aperture lens={lens} />
                </TableCell>
                <TableCell
                    align={isMobile ? undefined : 'right'}
                    className={isMobile ? `${styles.mobileCell} ${styles.sensorCell}` : undefined}
                >
                    <Sensor lens={lens} />
                </TableCell>
                <TableCell
                    align={isMobile ? undefined : 'right'}
                    data-testid={`dof-${lens.id}`}
                    className={isMobile ? `${styles.mobileCell} ${styles.dofCell}` : undefined}
                >
                    <div className={`${styles.dofLayout} ${isMobile ? '' : styles.desktopDofLayout}`}>
                        <Typography className={styles.dofValue}>{`${
                            isMobile ? 'Depth of field: ' : ''
                        }${displayDof}`}</Typography>
                        {isMobile ? <DeleteButton lenses={[lens.id]} /> : null}
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </div>
                </TableCell>
            </MuiTableRow>
            <DepthOfFieldDetails lens={lens} open={open} />
        </>
    )
}
