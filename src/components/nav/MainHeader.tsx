import { AppBar, Box, Grid2, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

import { logout } from "@/utils/auth";


interface Props {
    loggedIn?: boolean;
}


export default function MainHeader({loggedIn}:Props) {

    return (
        <Box>
            <AppBar position="static" sx={{
                backgroundColor: "background.paper", 
                color: "rgba(0,0,0,0.87)",
            }}>
                <Toolbar>
                    <Grid2>
                        <Box>
                            <Link href="/">
                                <Typography color="primary" variant="h4">
                                    CoderClub 
                                </Typography>
                            </Link>
                        </Box>
                    </Grid2>
                    <Grid2 flex={1} />
                    <Grid2 mr={3}>
                        <Link href="/sandbox">
                            <Typography variant="body1" >
                                Sandbox
                            </Typography>
                        </Link>
                    </Grid2>
                    {loggedIn && <Grid2>
                        <Box sx={{cursor: 'pointer'}} onClick={() => logout()}>
                            <Typography  variant="body1">
                                Logout
                            </Typography>
                        </Box>
                    </Grid2>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}