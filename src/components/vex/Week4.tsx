import { Box, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";
import {weeks} from "./Main"
import { PathSelctor } from "./PathSelector";
import { useState } from "react";
import { PrimaryLink } from "../misc/links";


export default function Week4() {

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="lg">
                <Box>
                    <Typography variant="h4">
                        Week 4: {weeks[4]}
                    </Typography>
                </Box>
                <Box mt={3}>
                    <Box mt={2}>
                        <Typography display="inline">
                            1. Finish writing the program at{' '}
                        </Typography> 
                        <PrimaryLink href="https://vr.vex.com/">
                            vr.vex.com 
                        </PrimaryLink>
                        <Typography display="inline">
                            {' '}you started last week!
                        </Typography>
                        <Typography pl={2.2}>
                            Your team's job is to program the robot to drive to each "house," with as few code blocks as possible. The neighborhood looks likes this:
                        </Typography>
                        <img src="/vex-week-3/easy_neighborhood.png" />
                        <Typography>
                            The robot should follow the path on the road shown by the red arrows.
                        </Typography>
                        <Typography display="inline">
                            Write your code in the simulation, and when you're ready to run it on the physical robot,{' '}
                        </Typography>
                        <PrimaryLink href="https://docs.google.com/forms/d/e/1FAIpQLSfjG1UhZPVS-yMYXGLUUvLGCm5epwvOWIWZyYdBHod1zyt0bg/viewform?usp=header">
                            submit your code here.
                        </PrimaryLink>
                        <Typography>
                            We will then run the code on the robot!
                        </Typography>
                    </Box>    
                    <Box mt={2}>
                        <Typography>
                            2. Once you finish the neighborhood, you can move on to the challenge course!
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}