import { Box, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";
import {weeks} from "./Main"
import { PathSelctor } from "./PathSelector";
import { useState } from "react";
import { PrimaryLink } from "../misc/links";


export default function Week5() {

    const [path, setPath] = useState('Coding Team');

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="lg">
                <Box>
                    <Typography variant="h4">
                        Week 5: {weeks[5]}
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
                            <PrimaryLink href="https://vr.vex.com" target="_blank">vr.vex.com</PrimaryLink> 
                            <Typography display="inline">
                                {' '} and click on the "Students Get Started" button when the page opens.
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                2. Complete the{' '}
                            </Typography> 
                            <PrimaryLink href="https://docs.google.com/document/d/1p6BAxG8yYlAR2GoyqvI8RomMUoJxECHOzQH4HpB8Q00/edit?tab=t.0#heading=h.1fob9te" target="_blank">Disk Mover Challenge.</PrimaryLink>
                            <Typography display="inline">
                                {' '}Your robot will do more than just drive now!
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                3. Next, learn how to use the pen by trying to{' '}
                            </Typography> 
                            <PrimaryLink href="https://docs.google.com/document/d/1FTHiOUjd-AqsjhczydnLvKi69yX3fJY3KspG4NhMdCQ/edit?tab=t.0#heading=h.1fob9te" target="_blank">Draw a house!</PrimaryLink>
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                4. Once you've done that, draw{' '}
                            </Typography>
                            <PrimaryLink href="https://docs.google.com/document/d/1feJHd-7GVR98opnd5nV5mjmKK6O9d_2-ylXp0kduiPQ/edit?tab=t.0#heading=h.1fob9te" target="_blank">your initials!</PrimaryLink>
                        </Box>
                    </Box> : <Box>
                        <Box>
                            <Typography>
                                We will start building the Claw Bot!
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                1. Follow the build instructions for the base bot{' '}
                            </Typography>
                            <PrimaryLink href="https://content.vexrobotics.com/stem-labs/iq/builds/basebot/iq-2nd-gen-basebot-rev12.pdf" target="_blank">Build Instructions</PrimaryLink>
                        </Box>
                        <Box mt={2}>
                            <Typography>
                                2. Test drive the robot!
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                3. Once the base bot is built, we can add the moving claw!{' '}
                            </Typography>
                            <PrimaryLink href="https://content.vexrobotics.com/stem-labs/iq/builds/clawbot/clawbot-rev4.pdf" target="_blank">Build Instructions</PrimaryLink>
                        </Box>
                    </Box>}
                </Box>
            </Container>
        </Box>
    )
}