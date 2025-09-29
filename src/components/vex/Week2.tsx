import { Box, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";
import {weeks} from "./Main"
import { PathSelctor } from "./PathSelector";
import { useState } from "react";
import { PrimaryLink } from "../misc/links";


export default function Week2() {

    const [path, setPath] = useState('Coding Team');

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="lg">
                <Box>
                    <Typography variant="h4">
                        Week 2: {weeks[2]}
                    </Typography>
                </Box>
                <Box mt={3}>
                    <PathSelctor path={path} setPath={setPath} />
                </Box>
                <Box mt={3}>
                    {path == "Coding Team" ? <Box>
                        <Box>
                            <Typography display="inline">
                                1. Go to{' '}
                            </Typography> 
                            <PrimaryLink href="https://vr.vex.com" target="_">vr.vex.com</PrimaryLink> 
                            <Typography display="inline">
                                {' '}Click on the "Students Get Started" button when the page opens, and follow the tour to learn about the environment!
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                2. Complete the{' '}
                            </Typography> 
                            <PrimaryLink href="https://docs.google.com/document/d/1izVTBW0AJeK3JR7a59CL0lA0ldfdoOWltfL0TicWHaI/edit?tab=t.0#heading=h.1fob9te" target="_">Distance Drive Challenge.</PrimaryLink>
                            <Typography display="inline">
                                {' '}You will learn how to move your robot!
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                3. Try to get your robot to do{' '}
                            </Typography> 
                            <PrimaryLink href="https://docs.google.com/document/d/1vNl_9wuVeRt91LvC0ADpCv4-HjO_g1Ly_H09sYEqhh0/edit?tab=t.0#heading=h.1fob9te" target="_">Basketball Drills!</PrimaryLink>
                            <Typography display="inline">
                                {' '}If you did coding club last semester, you might be able to use loops to make your code shorter.
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography>
                                4. Now, it's time for a race!  
                            </Typography>
                            <Typography pl={2}>
                                Some of the tiles in the classroom have been marked with a token. Write a program that will make the robot drive to each tile.
                            </Typography>
                            <Box pl={2}>
                                <Typography display="inline">
                                    Once your program has been tested in the simulation, copy your code over to{' '}
                                </Typography>
                                <PrimaryLink href="https://codeiq.vex.com/" target="_">codeiq.vex.com</PrimaryLink>
                                <Typography display="inline">
                                    {' '}We can then flash the robot with your program!
                                </Typography>
                            </Box>
                        </Box>
                    </Box> : <Box>
                        <Box>
                            <Typography>
                                We will be building the Speed Bot!
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography>
                                1. Open the bag of small parts into a bowl. This will make them easier to find during the build.
                            </Typography> 
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                2. Follow the build instructions{' '}
                            </Typography>
                            <PrimaryLink href="https://content.vexrobotics.com/stem-labs/iq/pdf/iq-2nd-gen-speedbot-v3.pdf" target="_">here!</PrimaryLink>
                        </Box>
                        <Box mt={2}>
                            <Typography>
                                3. Once the robot is built, each coding team will program it to complete a challenge!
                            </Typography>
                        </Box>
                    </Box>}
                </Box>
            </Container>
        </Box>
    )
}