import { Student } from "@/database/interfaces/Student";
import { TeacherData } from "@/pages/session/[url_name]";
import { Box, Container, Grid2, Typography } from "@mui/material";
import Students from "./Students";
import { MySession } from "@/database/interfaces/Session";
import { useState } from "react";
import Tutorials from "./Tutorials";
import { SessionTutorial } from "@/database/interfaces/SessionTutorial";


interface Props {
    session: MySession;
    students: Student[];
    tutorials: SessionTutorial[];
}


export default function TeacherMain({session, students: originalStudents, tutorials: originalTutorials}: Props) {

    const [students, setStudents] = useState(originalStudents)
    const [tutorials, setTutorials] = useState(originalTutorials)

    return (
        <Box my={3}>
            <Container maxWidth="xl">
                <Box mx={1}>
                    <Box mb={2}>
                        <Typography variant="h4">
                            {session.name}
                        </Typography>
                    </Box>
                    <Grid2 container>
                        <Grid2 size={{xs: 6, md: 3}}>
                            <Students session={session} students={students} setStudents={setStudents} />
                        </Grid2>
                        <Grid2 flex={1}>
                            <Tutorials session={session} tutorials={tutorials} setTutorials={setTutorials} />
                        </Grid2>
                    </Grid2>
                </Box>
            </Container>
        </Box>
    )
}