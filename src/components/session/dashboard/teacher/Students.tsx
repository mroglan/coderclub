import FormikTextField from "@/components/formik/TextField";
import { PurplePrimaryButton } from "@/components/misc/buttons";
import { C_Session } from "@/database/interfaces/Session";
import { C_Student } from "@/database/interfaces/Student";
import { Box, FormGroup, Grid2, Typography } from "@mui/material";
import axios from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction } from "react";


interface Props {
    session: C_Session;
    students: C_Student[];
    setStudents: Dispatch<SetStateAction<C_Student[]>>
}


interface FormVals {
    name: string;
}


export default function Students({session, students, setStudents}: Props) {

    console.log("students", students)

    const onSubmit = async (values: FormVals, actions: FormikHelpers<FormVals>) => {

        values.name = values.name.trim()

        if (students.map(s => s.data.name.toLowerCase()).includes(values.name)) {
            actions.setFieldError("name", "Name already in session")
            return actions.setSubmitting(false)
        }

        try {

            const {data} = await axios({
                method: "POST",
                url: `/api/session/${session.data.url_name}/student/add`,
                data: values
            })

            actions.setFieldValue("name", "")

            setStudents([...students, data.student])
        } catch (e) {
            actions.setFieldError("name", (e as any).response?.data?.msg)
            actions.setSubmitting(false)
        }
    }

    return (
        <Box>
            <Box mb={2}>
                <Typography variant="h5">
                    Students 
                </Typography>
            </Box>
            <Box mb={2}>
                {students.map(student => (
                    <Box key={student.data.name} my={1}>
                        <Typography variant="body1">
                            {student.data.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Box>
                <Formik initialValues={{name: ""}} onSubmit={(values, actions) => onSubmit(values, actions)}>
                    {({isSubmitting, isValidating}) => (
                        <Form>
                            <Box>
                                <Grid2 container>
                                    <Grid2 flex={1} minWidth={200}>
                                        <FormGroup>
                                            <FormikTextField name="name" label="New Student Name" />
                                        </FormGroup>
                                    </Grid2>
                                    <Grid2>
                                        <PurplePrimaryButton type="submit"
                                        disabled={isSubmitting || isValidating} fullWidth>
                                            Add
                                        </PurplePrimaryButton>
                                    </Grid2>
                                </Grid2>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}