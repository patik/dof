import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { apertureMap } from 'dof'
import useDoFStore from '../../../../store'

export default function Aperture({ lens }: { lens: LensDefinition }) {
    const { updateLens } = useDoFStore()
    const onChange = (event: SelectChangeEvent<string>) => {
        updateLens({ ...lens, aperture: event.target.value })
    }

    return (
        <FormControl fullWidth>
            <Select value={lens.aperture} onChange={onChange} size="small" data-testid={`aperture-${lens.id}`}>
                {Object.keys(apertureMap).map((key) => (
                    <MenuItem value={key} key={key}>
                        {key}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
