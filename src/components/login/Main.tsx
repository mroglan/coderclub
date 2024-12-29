import { Box, Container, Paper, Typography, FormGroup } from "@mui/material"
import { Formik, FormikHelpers, Form } from 'formik'
import * as yup from 'yup'
import FormikTextField from "../formik/TextField"
import FormikPasswordField from "../formik/PasswordField"
import { PurplePrimaryButton } from "../misc/buttons"
import axios, { AxiosError } from 'axios'
import Router from "next/router"

interface FormVals {
    email: string;
    password: string;
}

export default function Main() {

    const onSubmit = async (values: FormVals, actions:FormikHelpers<FormVals>) => {
        try {
            await axios({
                method: 'POST',
                url: '/api/login',
                data: values
            })

            Router.push({
                pathname: '/session'
            }) 
        } catch (e) {
            actions.setFieldError((e as any).response?.data?.field,
                (e as any).response?.data?.msg)
            actions.setSubmitting(false)
        }
    }

    return (
        <Box mt={3}>
            <Container maxWidth="sm">
                <Paper sx={{borderRadius: 5}} elevation={5}>
                    <Box p={3}>
                        <Box textAlign="center" mb={3}>
                            <Typography variant="h4">
                                Login
                            </Typography>
                        </Box>
                        <Box my={3} maxWidth={400} mx="auto">
                            <Formik validationSchema={yup.object({
                                email: yup.string().required('Please enter your email.')
                                    .email('Please enter a valid email.'),
                                password: yup.string().required('Please enter your password.')
                            })} initialValues={{email: '', password: ''}}
                            onSubmit={(values, actions) => onSubmit(values, actions)}>
                                {({isSubmitting, isValidating}) => (
                                    <Form>
                                        <Box my={3}>
                                            <FormGroup>
                                                <FormikTextField name="email" label="Email" />
                                            </FormGroup>
                                        </Box>
                                        <Box my={3}>
                                            <FormGroup>
                                                <FormikPasswordField name="password" label="Password" />
                                            </FormGroup>
                                        </Box>
                                        <Box my={3} maxWidth={200} mx="auto">
                                            <PurplePrimaryButton type="submit" 
                                                disabled={isSubmitting || isValidating} fullWidth>
                                                Login
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