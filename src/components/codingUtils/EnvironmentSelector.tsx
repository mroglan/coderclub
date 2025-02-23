import { Environment } from "@/utils/constants";
import { Box, FormControl, Grid2, InputLabel, MenuItem, Select } from "@mui/material";
import { Dispatch, SetStateAction } from "react";


interface Props {
    env: Environment;
    setEnv: Dispatch<SetStateAction<string>>;
    frozen?: boolean;
}


export default function EnvironmentSelector({env, setEnv, frozen}: Props) {

    return (
        <Box>
            <Grid2 container>
                <Grid2 minWidth={200}>
                    <FormControl fullWidth>
                        <InputLabel>Environment</InputLabel>
                        <Select value={env} onChange={(e) => setEnv(e.target.value)} disabled={frozen}
                            label="Environment" fullWidth>
                            {Object.values(Environment).map(k => (
                                <MenuItem key={k} value={k}>{k}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>
        </Box>
    )
}