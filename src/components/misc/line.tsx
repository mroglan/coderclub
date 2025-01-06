import { Box } from "@mui/material"

interface PurplePrimaryLineProps {
    height: number | string;
    width: number | string;
    borderRadius?: number;
}

export function PurplePrimaryLine(props: PurplePrimaryLineProps) {

    return (
        <Box {...props} bgcolor="primary.main" />
    )
}