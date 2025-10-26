import { Box, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";


export const weeks = {
    2: "It's a Race!",
    3: "Racing in Style",
    4: "Finishing the Race",
    5: "Introducing the Claw Bot!"
}

export default function Main() {

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="lg">
                <Box>
                    <Typography variant="h4">
                        Select a Week
                    </Typography>
                </Box>
                <Box mt={3}>
                    <Box maxWidth={600}>
                        {Object.entries(weeks).map(([week, name]) => (
                            <Box mb={3} key={week}>
                                <Link href="/vex/[week]" as={`/vex/week-${week}`}>
                                    <Paper elevation={3} sx={{backgroundColor: "hsl(287, 71%, 72%)", cursor: "pointer"}}>
                                        <Box p={3}>
                                            <Typography variant="h6">
                                                Week {week}: {name}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Link>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}