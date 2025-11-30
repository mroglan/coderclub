import { Box, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";
import {weeks} from "./Main"
import { PathSelctor } from "./PathSelector";
import { useState } from "react";
import { PrimaryLink } from "../misc/links";


export default function Week6() {

    const [path, setPath] = useState('Coding Team');

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="lg">
                <Box>
                    <Typography variant="h4">
                        Week 6: {weeks[6]}
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
                            <PrimaryLink href="https://docs.google.com/document/d/1sA8sdQdyHRWd2o3tlYtQq5YyTuyWVMdEmJIy9G1ZVHo/edit?tab=t.0#heading=h.1fob9te" target="_blank">Number Maze Challenge.</PrimaryLink>
                            <Typography display="inline">
                                {' '} (and if you want you can also do the{' '}
                            </Typography>
                            <PrimaryLink href="https://docs.google.com/document/d/1FJbm45Qgdrhzo7OEKFUeHcoCXd6lpmJGFsXBY9FJAwg/edit?tab=t.0#heading=h.1fob9te" target="_blank">Letter Maze Challenge!</PrimaryLink>
                            <Typography display="inline">
                                )
                            </Typography>
                        </Box>
                        <Box mt={2}>
                            <Typography display="inline">
                                3. Finally, use sensors on the robot to solve the{' '}
                            </Typography> 
                            <PrimaryLink href="https://docs.google.com/document/d/1Vy62wznMxqjwo6gutlGQLp-dPfk1HGzOrvwlKNoZ-7U/edit?tab=t.0#heading=h.1fob9te" target="_blank">Dynamic Maze!</PrimaryLink>
                            <Typography display="inline">
                                {' '}NOTE: Go ahead and skip to level 3, you have already prepared for it in the last activity!
                            </Typography> 
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