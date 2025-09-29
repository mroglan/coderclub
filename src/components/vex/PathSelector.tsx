
import { Box, Container, Grid2, Paper, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Link from "next/link";
import {weeks} from "./Main"
import { useState } from "react";


export function PathSelctor({path, setPath}) {

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setPath(newAlignment);
    };

    return (
        <Grid2 container alignItems="center" spacing={3}>
            <Grid2>
                <Typography variant="h6">
                    I'm on
                </Typography>
            </Grid2>
            <Grid2>
                <ToggleButtonGroup
                    color="primary"
                    value={path}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="Coding Team">Coding Team</ToggleButton>
                    <ToggleButton value="Build Team">Build Team</ToggleButton>
                </ToggleButtonGroup>
            </Grid2>
        </Grid2>
    )
}