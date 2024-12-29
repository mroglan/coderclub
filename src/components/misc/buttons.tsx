import { Button, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles'

export const PurplePrimaryButton = styled(Button)(({theme}) => ({
    background: theme.palette.primary.main,
    color: theme.palette.text.primary,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    transition: 'background 300ms',
    '&:hover': {
        background: theme.palette.primary.dark
    },
    '&.Mui-disabled': {
        color: theme.palette.text.secondary,
        opacity: 0.6
    }
}))