import { C_Session } from "@/database/interfaces/Session";
import { C_SessionTutorial } from "@/database/interfaces/SessionTutorial";
import { StudentFromJWT } from "@/utils/auth";
import { Box, Container, Grid2, Paper, Typography } from "@mui/material";
import Link from "next/link";


interface Props {
    session: C_Session;
    tutorials: C_SessionTutorial[];
    student: StudentFromJWT;
}


export default function StudentMain({session, tutorials, student}: Props) {

    console.log("tutorials", tutorials)

    return (
        <Box my={3}>
            <Container maxWidth="xl">
                <Box mx={1}>
                    <Box mb={2}>
                        <Typography variant="h4">
                            {session.data.name}
                        </Typography>
                    </Box>
                    <Grid2 container>
                        <Grid2 size={{xs: 6}}>
                            character customization
                        </Grid2>
                        <Grid2 flex={1}>
                            <Box>
                                {tutorials.map(tutorial => (
                                    <Box my={2} key={tutorial.data.name}>
                                        <Link href="/session/{url_name}/tutorial/{tutorial_name}"
                                            as={`/session/${session.data.url_name}/tutorial/${tutorial.data.name}`}>
                                            <Paper elevation={5}>
                                                <Box p={3}>
                                                    <Box mb={3}>
                                                        <Typography variant="h3" color="primary">
                                                            {tutorial.data.name} 
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="button">
                                                            START TUTORIAL
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Grid2>
                    </Grid2>
                </Box>
            </Container>
        </Box>
    )
}