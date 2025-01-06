import { Alert, Box, Container, Grid2, Paper, Typography } from "@mui/material"
import { Form, Formik, FormikHelpers } from "formik"
import FormikTextField from "../formik/TextField";
import { PurplePrimaryLine } from "../misc/line";
import { PurplePrimaryButton } from "../misc/buttons";
import { useState } from "react";
import axios from "axios";


interface FormVals {
    name: string;
    session: string;
}


export default function Main() {

    const [alert, setAlert] = useState("")

    const onSubmit = async (values: FormVals, actions:FormikHelpers<FormVals>) => {
        values.name = values.name.trim()
        values.session = values.session.trim()
        if (values.name === "") {
            setAlert("Please enter your name")
            return
        }
        if (values.session === "") {
            setAlert("Please enter a session")
            return
        }
        let tmpUniqueId = localStorage.getItem("coderClubId")
        if (!tmpUniqueId) {
            tmpUniqueId = window.crypto.randomUUID()
            localStorage.setItem("coderClubId", tmpUniqueId)
        }
        console.log(tmpUniqueId)
        try {
            const {data} = await axios({
                method: "POST",
                url: "/api/session/join",
                data: {...values, tmpUniqueId}
            })

            console.log(data)

        } catch (e) {
            setAlert((e as any)?.response?.data?.msg)
        }
    }

    return (
        <Box my={3}>
            <Container maxWidth="md">
                <Paper sx={{borderRadius: 5}} elevation={5}>
                    <Box p={3}>
                        <Box textAlign="center" mb={3}>
                            <Typography color="primary" variant="h3">
                                Join a Session
                            </Typography>
                        </Box>
                        <Box maxWidth={500} mx="auto" pb={3}>
                            <PurplePrimaryLine height={5} width="100%" borderRadius={5} />
                        </Box>
                        {alert && <Box mb={3} maxWidth={500} mx="auto">
                            <Alert severity="error" variant="outlined" onClose={() => setAlert("")}>
                                {alert}
                            </Alert>
                        </Box>}
                        <Box my={3} maxWidth={500} mx="auto">
                            <Formik initialValues={{name: "", session: ""}} 
                                onSubmit={(values, actions) => onSubmit(values, actions)}>
                                {({isSubmitting, isValidating}) => (
                                    <Form>
                                        <Box my={3}>
                                            <Box mb={1}>
                                                <Typography variant="h5">
                                                    Your Name
                                                </Typography>
                                            </Box>
                                            <FormikTextField name="name" />
                                        </Box>
                                        <Box my={3}>
                                            <Typography variant="h5" mb={1}>
                                                Session
                                            </Typography>
                                            <FormikTextField name="session" />
                                        </Box>
                                        <Box mb={3} mt={6} maxWidth={400} mx="auto">
                                            <PurplePrimaryButton type="submit" 
                                                disabled={isSubmitting || isValidating} fullWidth>
                                                Join Session
                                            </PurplePrimaryButton>
                                        </Box>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}