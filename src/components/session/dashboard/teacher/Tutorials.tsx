import { PurplePrimaryButton } from "@/components/misc/buttons";
import { C_Session } from "@/database/interfaces/Session";
import { C_SessionTutorial, TUTORIAL_NAMES, TUTORIAL_STEPS } from "@/database/interfaces/SessionTutorial";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, Grid2, InputLabel, List, ListItem, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { PrimaryLink } from "@/components/misc/links";


interface Props {
    session: C_Session;
    tutorials: C_SessionTutorial[];
    setTutorials: Dispatch<SetStateAction<C_SessionTutorial[]>>
}


const stepToUrlName = (step: string) => {
    return step.split(" ").join("_")
}


export default function Tutorials({session, tutorials, setTutorials}: Props) {

    console.log("tutorials", tutorials)

    const [adding, setAdding] = useState(false)
    const [tutorialToAdd, setTutorialToAdd] = useState("")

    const possibleTutorialsToAdd = useMemo(() => (
        TUTORIAL_NAMES.filter(n => !tutorials.find(t => t.data.name === n))
    ), [tutorials])

    const changeTutorialToAdd = (e: SelectChangeEvent) => {
        setTutorialToAdd(e.target.value)
    }

    const addTutorial = async () => {
        if (!tutorialToAdd) return

        setAdding(true)

        try {

            const {data} = await axios({
                method: "POST",
                url: `/api/session/${session.data.url_name}/tutorial/add`,
                data: {
                    name: tutorialToAdd
                }
            })

            setTutorialToAdd("")
            setTutorials([...tutorials, data.tutorial])
        } catch (e) {
            console.log(e)
        } finally {
            setAdding(false)
        }
    }

    return (
        <Box ml={3} mb={2}>
            <Box mb={2}>
                <Typography variant="h5">
                    Tutorials
                </Typography>
            </Box>
            <Box>
                {tutorials.map(tutorial => (
                    <Box key={tutorial.data.name}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">
                                    {tutorial.data.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box mb={3}>
                                    <List>
                                        {(TUTORIAL_STEPS as any)[tutorial.data.name].map((step: string) => (
                                            <ListItem key={step} sx={{mb: 1}}>
                                                <Grid2 container alignItems="center" width="100%">
                                                    <Grid2 flex={1}>
                                                        <Typography variant="body1">
                                                            {step}
                                                        </Typography>
                                                    </Grid2>
                                                    <Grid2>
                                                        <Button>
                                                            Solutions Locked
                                                        </Button>
                                                    </Grid2>
                                                </Grid2>
                                            </ListItem>
                                        ))} 
                                    </List>
                                </Box>
                                <Box>
                                    <PurplePrimaryButton>
                                        Remove Tutorial
                                    </PurplePrimaryButton>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                ))}
            </Box>
            <Box mt={3}>
                <Grid2 container spacing={3}>
                    <Grid2 flex={1}>
                        <FormControl fullWidth>
                            <InputLabel id="add-tutorial-label">Add Tutorial</InputLabel>
                            <Select
                                labelId="add-tutorial-label"
                                id="add-tutorial"
                                value={tutorialToAdd}
                                label="Add Tutorial"
                                onChange={changeTutorialToAdd}
                            >
                                {possibleTutorialsToAdd.map(tutorial => (
                                    <MenuItem key={tutorial} value={tutorial}>
                                        {tutorial}
                                    </MenuItem>
                                ))}    
                            </Select>
                            </FormControl>
                    </Grid2>
                    <Grid2 size={{xs: 3}}>
                        <PurplePrimaryButton disabled={adding} onClick={() => addTutorial()}>
                            Add
                        </PurplePrimaryButton>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    )
}