import { InputAdornment, TextField } from '@mui/material'
import type { ChangeEvent } from 'react'
import useDoFStore from '../../../../store'
import useIsMobile from '../../../../utilities/useIsMobile'

export default function FocalLength({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const isMobile = useIsMobile()
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateLens({ ...lens, focalLength: parseFloat(event.target.value) })
    }

    return (
        <TextField
            label="Focal length"
            onChange={onChange}
            value={lens.focalLength}
            type="number"
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                },
                htmlInput: {
                    min: 0,
                    step: 1,
                },
                inputLabel: {
                    shrink: true,
                },
            }}
            data-testid={`focal-length-${lens.id}`}
            size="small"
            fullWidth={isMobile}
            autoComplete="off"
        />
    )
}
