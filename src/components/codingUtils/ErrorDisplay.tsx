import { Box, Grid2, IconButton, Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


interface Props {
    error: string;
}


export function DefaultErrorDisplay({error}: Props) {

    const [hidden, setHidden] = useState(false)

    useMemo(() => {
        if (error) {
            setHidden(false)
        }
    }, [error])

    const boxProps = hidden ? {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%"
    } : {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        overflowY: "scroll"
    }

    const toggleHidden = () => {
        setHidden(!hidden)
    }

    if (!error) {
        return null
    }

    return (
        <Box sx={boxProps as any}>
                {hidden ? 
                <Paper elevation={5}>
                    <Box p={2}>
                        <Grid2 container alignItems="center">
                            <Grid2 flex={1}>
                                <Typography variant="h5" color="error">
                                    Error!
                                </Typography>
                            </Grid2>
                            <Grid2>
                                <IconButton onClick={toggleHidden}>
                                    <ArrowDropUpIcon />
                                </IconButton>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Paper> :
                <Paper elevation={5} sx={{minHeight: "100%"}}>
                    <Box p={3}>
                        <Box mb={2}>
                            <Grid2 container alignItems="center">
                                <Grid2 flex={1}>
                                    <Typography variant="h5" color="error">
                                        Error!
                                    </Typography>
                                </Grid2>
                                <Grid2>
                                    <IconButton onClick={toggleHidden}>
                                        <ArrowDropDownIcon />
                                    </IconButton>
                                </Grid2>
                            </Grid2>
                        </Box>
                        <Box>
                            <Typography variant="body1">
                                {error}
                            </Typography>
                        </Box>   
                    </Box>
                </Paper>
                }
        </Box>
    )
}