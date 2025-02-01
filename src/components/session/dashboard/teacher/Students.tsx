import FormikTextField from "@/components/formik/TextField";
import { PurplePrimaryButton } from "@/components/misc/buttons";
import { MySession } from "@/database/interfaces/Session";
import { Student } from "@/database/interfaces/Student";
import { Box, FormGroup, Grid2, IconButton, Typography } from "@mui/material";
import axios from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


interface Props {
    session: MySession;
    students: Student[];
    setStudents: Dispatch<SetStateAction<Student[]>>
}


interface FormVals {
    name: string;
}


export default function Students({session, students, setStudents}: Props) {

    console.log("students", students)

    const [deleting, setDeleting] = useState(false)

    const onSubmit = async (values: FormVals, actions: FormikHelpers<FormVals>) => {

        values.name = values.name.trim()

        if (students.map(s => s.name.toLowerCase()).includes(values.name)) {
            actions.setFieldError("name", "Name already in session")
            return actions.setSubmitting(false)
        }

        try {

            const {data} = await axios({
                method: "POST",
                url: `/api/session/${session.url_name}/student/add`,
                data: {
                    name: values.name,
                    sessionId: session.id
                }
            })

            actions.setFieldValue("name", "")

            setStudents([...students, data.student.data])
        } catch (e) {
            actions.setFieldError("name", (e as any).response?.data?.msg)
            actions.setSubmitting(false)
        }
    }

    const removeStudent = async (studentId: string) => {

        setDeleting(true)

        try {

            await axios({
                method: "POST",
                url: `/api/session/${session.url_name}/student/remove`,
                data: {studentId}
            })

            setDeleting(false)
            setStudents(students.filter(s => s.id != studentId))
        } catch (e) {
            console.log(e)
            setDeleting(false)
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
                    <Box key={student.name} my={1}>
                        <Grid2 container alignItems="center">
                            <Grid2 flex={1}>
                                <Typography variant="body1">
                                    {student.name}
                                </Typography>
                            </Grid2>
                            <Grid2>
                                <IconButton color="primary" disabled={deleting} onClick={() => removeStudent(student.id)}>
                                    <DeleteOutlineIcon /> 
                                </IconButton>
                            </Grid2>
                        </Grid2>
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