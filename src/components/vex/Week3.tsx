import { Box, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";
import {weeks} from "./Main"
import { PathSelctor } from "./PathSelector";
import { useState } from "react";
import { PrimaryLink } from "../misc/links";


export default function Week3() {

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="lg">
                <Box>
                    <Typography variant="h4">
                        Week 3: {weeks[3]}
                    </Typography>
                </Box>
                <Box mt={3}>
                    <Box>
                        <Typography display="inline">
                            1. Pay attention as we complete the Basketball Drills - we will learn about variables, and repeat blocks!
                        </Typography> 
                    </Box>
                    <Box mt={2}>
                        <Typography>
                            2. You will be on a team with 1-2 other coders.
                        </Typography> 
                        <Typography pl={2.2}>
                            Your team's job is to program the robot to drive to each "house," with as few code blocks as possible. The neighborhood looks likes this:
                        </Typography>
                        <img src="/vex-week-3/easy_neighborhood.png" />
                        <Typography>
                            The robot should follow the path on the road shown by the red arrows.
                        </Typography>
                        <Typography>
                            Write your code in the simulation, and when you're ready to run it on the physical robot, move on to the next step!
                        </Typography>
                    </Box>    
                    <Box mt={2}>
                        <Typography display="inline">
                            3. Go to{' '}
                        </Typography>
                        <PrimaryLink target="_blank" href="/vex/prepare-to-program-the-robot">
                            coderclub.org/vex/prepare-to-program-the-robot
                        </PrimaryLink>
                        <Typography display="inline">
                            , and follow the guide to prepare to program the robot.
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography>
                            4. Teams that finish the neighborhood, will move on to a special challenge course.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}