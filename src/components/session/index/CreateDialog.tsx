import FormikTextField from "@/components/formik/TextField";
import { PurplePrimaryButton } from "@/components/misc/buttons";
import { C_Teacher } from "@/database/interfaces/Teacher";
import { Box, Dialog, DialogContent, FormGroup, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import * as yup from "yup"
import Router from "next/router"


interface Props {
    open: boolean;
    onClose: () => void;
}


interface FormVals {
    name: string;
}


export function CreateDialog({open, onClose}: Props) {

    const onSubmit = async (values: FormVals, actions: FormikHelpers<FormVals>) => {
        try {

            const {data} = await axios({
                method: "POST",
                url: "/api/session/create",
                data: {
                    name: values.name
                }
            })

            Router.push({
                pathname: `/session/${data.url_name}`
            })            

        } catch (error: any) {
            if (error?.response?.status === 409) {
                actions.setFieldError("name", error.response.data.msg)
            }
            console.log(error)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <Box minWidth={500} textAlign="center">
                    <Typography variant="h6">
                        Create new Session
                    </Typography>
                    <Box>
                        <Formik validationSchema={yup.object({
                            name: yup.string().required()
                        })} initialValues={{name: ''}} onSubmit={(values, actions) => onSubmit(values, actions)}>
                            {({isSubmitting, isValidating}) => (
                                <Form>
                                    <Box my={3}>
                                        <FormGroup>
                                            <FormikTextField name="name" label="Name" />
                                        </FormGroup>
                                    </Box>
                                    <Box my={3} maxWidth={200} mx="auto">
                                        <PurplePrimaryButton type="submit"
                                        disabled={isSubmitting || isValidating} fullWidth>
                                            Create
                                        </PurplePrimaryButton>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}