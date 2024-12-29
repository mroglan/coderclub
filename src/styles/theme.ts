import { createTheme } from "@mui/material"

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: "hsl(287, 71%, 52%)"
        },
        background: {
            default: "hsl(257, 2%, 5%)",
            paper: "hsl(257, 2%, 10%)"
        }
    }
})