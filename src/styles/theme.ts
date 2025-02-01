import { createTheme } from "@mui/material"

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: "hsl(287, 71%, 52%)",
            dark: "hsl(287, 71%, 36%)"
        },
        background: {
            default: "hsl(287, 98%, 98%)",
            paper: "#fff"
        },
        success: {
            main: "hsl(131, 83%, 45%)",
            dark: "hsl(131, 83%, 32%)",
        },
        error: {
            main: "hsl(355, 83%, 45%)",
            dark: "hsl(355, 83%, 32%)",
        }
    }
})