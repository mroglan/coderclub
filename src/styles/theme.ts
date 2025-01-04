import { createTheme } from "@mui/material"

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: "hsl(287, 71%, 52%)"
        },
        background: {
            default: "hsl(287, 98%, 98%)",
            paper: "#fff"
        }
    }
})