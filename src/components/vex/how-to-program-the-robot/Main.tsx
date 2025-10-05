import { PrimaryLink } from "@/components/misc/links";
import { Box, Container, Typography } from "@mui/material";

export default function Main() {

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="lg">
                <Box>
                    <Typography variant="h4">
                        Prepare to Program the Robot
                    </Typography>
                </Box>
                <Box mt={3}>
                    <Box>
                        <Typography>
                            1. Click on the code button to view your python code: 
                        </Typography>
                        <img src="/vex-how-to-program-the-robot/select-python-code.png" height={300} />
                    </Box>
                    <Box mt={5}>
                        <Typography>
                            2. Copy the code
                        </Typography>
                        <img src="/vex-how-to-program-the-robot/copy-code.png" height={300} />
                    </Box>
                    <Box mt={5}>
                        <Typography display="inline">
                            3. Paste the code into{' '}
                        </Typography>
                        <PrimaryLink target="_blank" href="/vex/vr-to-iq">
                            coderclub.org/vex/vr-to-iq.  
                        </PrimaryLink>
                        <img src="/vex-how-to-program-the-robot/paste-code.png" height={300} />
                    </Box>
                    <Box mt={5}>
                        <Typography>
                            4. Click "Download Converted Code"
                        </Typography>
                        <img src="/vex-how-to-program-the-robot/download-code.png" height={300} />
                    </Box>
                    <Box mt={5}>
                        <Typography display="inline">
                            5. Go to{' '}
                        </Typography>
                        <PrimaryLink target="_blank" href="https://codeiq.vex.com/">
                            codeiq.vex.com
                        </PrimaryLink>
                        <Typography display="inline">
                            . Click File ={'>'} Open, and select the file that was just downloaded.
                        </Typography>
                        <img src="/vex-how-to-program-the-robot/open-code.png" height={300} />
                    </Box>
                    <Box mt={5}>
                        6. Ask for the robot! It's ready to go!
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}