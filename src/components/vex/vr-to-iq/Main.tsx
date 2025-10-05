import { Box, Checkbox, Container, FormControl, FormControlLabel, Grid2, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { convertCode, removeConfigurationCode } from "./convertCode";


const builds = [
    "Speed Build"
]


export default function Main() {

    const [inputBuild, setInputBuild] = useState("Speed Build")
    const [inputCode, setInputCode] = useState("")
    const [hideConfigCode, setHideConfigCode] = useState(true)

    const [convertedCode, setConvertedCode] = useState("")
    const [shownConvertedCode, setShownConvertedCode] = useState("")


    useMemo(() => {
        const _convertedCode = convertCode(inputCode, inputBuild)
        setConvertedCode(_convertedCode)
        if (hideConfigCode){
            setShownConvertedCode(removeConfigurationCode(_convertedCode))
        } else {
            setShownConvertedCode(_convertedCode)
        }
    }, [inputCode, hideConfigCode])

    console.log(hideConfigCode)

    return (
        <Box mt={3}>
            <Container maxWidth="lg">
                <Box>
                    <FormControl>
                        <InputLabel id="build-label">Build</InputLabel>
                        <Select
                            labelId="build-label"
                            value={inputBuild}
                            onChange={(e) => setInputBuild(e.target.value)}
                            label="Build"
                        >
                            {builds.map((build) => (
                            <MenuItem key={build} value={build}>
                                {build}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>

                </Box>
                <Box sx={{height: "calc(100vh - 200px)"}}>
                    <Grid2 container height="100%" spacing={3}>
                        <Grid2 size={{xs: 6}} height="100%">
                            <Box display="flex" height="100%" flexDirection="column">
                                <Typography variant="h6">
                                    Enter your Vexcode VR Code here:
                                </Typography>
                            <Box flex={1} mt={1}>
                                <textarea
                                    style={{
                                        width: "100%",
                                        height: "100%",        // fill the parent Box
                                        resize: "none",        // disable resize handle
                                        overflow: "auto",      // allow scrolling
                                        boxSizing: "border-box"
                                    }}
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    />
                            </Box>
                            </Box>
                        </Grid2>
                        <Grid2 size={{xs: 6}} height="100%">
                            <Box display="flex" height="100%" flexDirection="column">
                                <Typography variant="h6">
                                    Converted code:
                                </Typography> 
                                <Box flex={1} mt={1}>
                                    <textarea
                                        style={{
                                            width: "100%",
                                            height: "100%",        // fill the parent Box
                                            resize: "none",        // disable resize handle
                                            overflow: "auto",      // allow scrolling
                                            boxSizing: "border-box"
                                        }}
                                        value={shownConvertedCode}
                                        onChange={(e) => setShownConvertedCode(e.target.value)}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Box>
                                    <FormControl>
                                        <FormControlLabel control={<Checkbox value={hideConfigCode} onChange={(e) => setHideConfigCode(Boolean(e.target.checked))} defaultChecked />} label="Hide Configuration Code" />
                                    </FormControl>
                                </Box>
                                <Box>
                                    download code
                                </Box>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Box>
            </Container>
        </Box>
    )
}