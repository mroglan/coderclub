import { AppBar, Box, Grid2, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

interface Props {
    loggedIn?: boolean;
}

export default function MainHeader({loggedIn}:Props) {

    return (
        <Box>
            <AppBar position="static" sx={{backgroundColor: "background.paper"}}>
                <Toolbar>
                    <Grid2>
                        <Box>
                            <Link href="/">
                                <Typography variant="h4">
                                    CoderClub 
                                </Typography>
                            </Link>
                        </Box>
                    </Grid2>
                    <Grid2 flex={1} />
                    {loggedIn && <Grid2>
                        {/* <Box sx={{cursor: 'pointer'}} onClick={() => logout()}>
                            <Typography variant="body1">
                                Logout
                            </Typography>
                        </Box> */}
                    </Grid2>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}