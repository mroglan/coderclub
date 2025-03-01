import { PrimaryLink } from "@/components/misc/links";
import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";


export default function Main() {

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="lg">
                <Box>
                    <Box mb={3}>
                        <Typography variant="h4">
                            How to Import Images from Piskel
                        </Typography>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h6" display="inline">
                            1. Navigate to{' '}
                        </Typography>
                        <PrimaryLink variant="h6"
                        href="https://www.piskelapp.com/p/create/sprite" target="_blank">
                            Piskel
                        </PrimaryLink>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h6">
                            2. Create images (i.e. "frames") in Piskel. Note the max resolution supported by CoderClub is 32 x 32 pixels.
                        </Typography>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h6">
                            When you're ready to use your images in CoderClub,
                        </Typography>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h6">
                            3. On the right-hand side of the screen, click the export button
                        </Typography>
                    </Box>
                    <Box mb={1}>
                        <Image alt="Image of where to click for exporting from piskel"
                            src="/how/importpiskel/piskelexport.png" width={300} height={300} />
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h6">
                            4. Then, download the "Spritesheet with JSON metadata". Make sure to click the check box for "Inline spritesheet as data-uri."
                        </Typography>
                    </Box>
                    <Box mb={1}>
                        <Image alt="Image of where to download JSON spritesheet."
                            src="/how/importpiskel/piskelexport2.png" width={300} height={500} />
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h6">
                            5. A zip file will be downloaded. Inside the zip file, you will find a singular JSON file. Upload that JSON file to CoderClub!
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}